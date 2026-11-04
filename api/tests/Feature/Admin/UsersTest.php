<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class UsersTest extends TestCase
{
    use RefreshDatabase, UsesDashboard;

    public function test_an_admin_creates_and_edits_accounts(): void
    {
        $this->signIn();

        $id = $this->postJson('/admin/v1/users', [
            'name' => 'سارة',
            'email' => 'Sara@UFUQ.ps',
            'role' => 'editor',
            'password' => 'a-long-password',
        ])
            ->assertCreated()
            ->assertJsonPath('data.email', 'sara@ufuq.ps')
            ->assertJsonPath('data.role', 'editor')
            ->assertJsonMissingPath('data.password')
            ->json('data.id');

        $this->assertTrue(Hash::check('a-long-password', User::find($id)->password));

        // No password on update: the old one stays.
        $this->putJson("/admin/v1/users/{$id}", ['name' => 'سارة أحمد', 'email' => 'sara@ufuq.ps', 'role' => 'admin'])
            ->assertOk()
            ->assertJsonPath('data.role', 'admin');
        $this->assertTrue(Hash::check('a-long-password', User::find($id)->password));

        $this->getJson('/admin/v1/users')->assertOk()->assertJsonCount(2, 'data');
        $this->getJson("/admin/v1/users/{$id}")->assertOk()->assertJsonPath('data.name', 'سارة أحمد');
    }

    public function test_account_input_is_checked_in_arabic(): void
    {
        $admin = $this->signIn();

        $this->postJson('/admin/v1/users', [
            'name' => 'سارة',
            'email' => $admin->email,
            'role' => 'owner',
            'password' => 'short',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'email' => 'هذا البريد مستخدم لحساب آخر.',
                'role' => 'قيمة الصلاحية غير معروفة.',
                'password' => 'يجب ألا يقل طول كلمة المرور عن 10 أحرف.',
            ]);
    }

    public function test_an_admin_cannot_delete_or_demote_themself(): void
    {
        $admin = $this->signIn();
        User::factory()->admin()->create();

        $this->deleteJson("/admin/v1/users/{$admin->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['user' => 'لا يمكنك حذف حسابك.']);

        $this->putJson("/admin/v1/users/{$admin->id}", ['name' => $admin->name, 'email' => $admin->email, 'role' => 'editor'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['role' => 'لا يمكنك سحب صلاحية المدير من حسابك.']);

        $this->assertSame(UserRole::Admin, $admin->fresh()->role);
    }

    public function test_the_last_admin_always_remains(): void
    {
        $admin = $this->signIn();

        $this->deleteJson("/admin/v1/users/{$admin->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['user' => 'لا يمكن حذف آخر مدير في النظام.']);

        $this->putJson("/admin/v1/users/{$admin->id}", ['name' => $admin->name, 'email' => $admin->email, 'role' => 'editor'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['role' => 'لا يمكن سحب صلاحية المدير من آخر مدير في النظام.']);

        $this->assertModelExists($admin);
    }

    public function test_the_first_admin_is_created_from_the_shell(): void
    {
        $this->artisan('users:create')
            ->expectsQuestion('Name', 'محمد')
            ->expectsQuestion('Email', 'Mohammed@UFUQ.ps')
            ->expectsChoice('Role', 'admin', ['admin', 'editor'])
            ->expectsQuestion('Password (at least 10 characters)', 'a-long-password')
            ->expectsQuestion('Confirm password', 'a-long-password')
            ->expectsOutput('Created admin account mohammed@ufuq.ps.')
            ->assertSuccessful();

        $this->assertSame(UserRole::Admin, User::where('email', 'mohammed@ufuq.ps')->sole()->role);

        $this->artisan('users:create')
            ->expectsQuestion('Name', 'سارة')
            ->expectsQuestion('Email', 'sara@ufuq.ps')
            ->expectsChoice('Role', 'editor', ['admin', 'editor'])
            ->expectsQuestion('Password (at least 10 characters)', 'a-long-password')
            ->expectsQuestion('Confirm password', 'different-password')
            ->assertFailed();

        $this->assertSame(1, User::count());
    }

    public function test_an_admin_removes_another_account(): void
    {
        $this->signIn();
        $other = User::factory()->admin()->create();

        $this->putJson("/admin/v1/users/{$other->id}", ['name' => $other->name, 'email' => $other->email, 'role' => 'editor'])
            ->assertOk();
        $this->deleteJson("/admin/v1/users/{$other->id}")->assertNoContent();

        $this->assertModelMissing($other);
    }
}
