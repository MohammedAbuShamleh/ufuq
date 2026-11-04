<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase, UsesDashboard;

    public function test_a_user_signs_in_with_email_and_password(): void
    {
        $user = User::factory()->create([
            'email' => 'editor@ufuq.test',
            'password' => 'long-enough-secret',
            'role' => UserRole::Editor,
        ]);

        $this->statefulDashboard()
            ->postJson('/admin/v1/login', ['email' => 'Editor@ufuq.test', 'password' => 'long-enough-secret', 'remember' => true])
            ->assertOk()
            ->assertExactJson(['data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => 'editor@ufuq.test',
                'role' => 'editor',
            ]]);

        $this->assertAuthenticatedAs($user, 'web');

        $this->statefulDashboard()->getJson('/admin/v1/me')->assertOk()->assertJsonPath('data.role', 'editor');
    }

    public function test_a_wrong_password_is_refused_in_arabic(): void
    {
        User::factory()->create(['email' => 'admin@ufuq.test', 'password' => 'long-enough-secret']);

        $this->statefulDashboard()
            ->postJson('/admin/v1/login', ['email' => 'admin@ufuq.test', 'password' => 'wrong-password'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => 'البريد أو كلمة المرور غير صحيحة.']);

        $this->assertGuest('web');
    }

    public function test_missing_fields_get_arabic_messages(): void
    {
        $this->statefulDashboard()
            ->postJson('/admin/v1/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'email' => 'حقل البريد الإلكتروني مطلوب.',
                'password' => 'حقل كلمة المرور مطلوب.',
            ])
            ->assertJsonPath('message', 'حقل البريد الإلكتروني مطلوب. (وخطأ آخر)');
    }

    public function test_sign_in_is_limited_to_five_attempts_a_minute(): void
    {
        User::factory()->create(['email' => 'admin@ufuq.test', 'password' => 'long-enough-secret']);

        foreach (range(1, 5) as $i) {
            $this->statefulDashboard()
                ->postJson('/admin/v1/login', ['email' => 'admin@ufuq.test', 'password' => "guess-{$i}"])
                ->assertUnprocessable();
        }

        $this->statefulDashboard()
            ->postJson('/admin/v1/login', ['email' => 'admin@ufuq.test', 'password' => 'long-enough-secret'])
            ->assertTooManyRequests()
            ->assertJsonPath('message', fn (string $message) => str_starts_with($message, 'محاولات دخول كثيرة.'));
    }

    public function test_a_guest_gets_a_json_401_and_never_a_redirect(): void
    {
        // No Accept header: the response is still JSON, not a redirect to a login page.
        $this->get('/admin/v1/me')
            ->assertUnauthorized()
            ->assertExactJson(['message' => 'سجّل الدخول أولاً.']);

        $this->getJson('/admin/v1/projects')->assertUnauthorized();
    }

    public function test_signing_out_ends_the_session(): void
    {
        $this->signIn();

        $this->statefulDashboard()->postJson('/admin/v1/logout')->assertNoContent();

        $this->assertGuest('web');
    }

    public function test_a_bearer_token_is_ignored(): void
    {
        // There is no tokens table: a token-shaped header must not reach a query.
        $this->withToken('1|abcdef')->getJson('/admin/v1/me')->assertUnauthorized();
    }

    public function test_the_dashboard_origin_may_call_with_credentials(): void
    {
        config(['cors.allowed_origins' => ['https://ufuq.ps', 'https://admin.ufuq.ps']]);

        $this->call('OPTIONS', '/admin/v1/login', server: [
            'HTTP_ORIGIN' => 'https://admin.ufuq.ps',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'x-xsrf-token',
        ])
            ->assertHeader('Access-Control-Allow-Origin', 'https://admin.ufuq.ps')
            ->assertHeader('Access-Control-Allow-Credentials', 'true');
    }
}
