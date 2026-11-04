<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase, UsesDashboard;

    public function test_an_editor_cannot_reach_settings_or_users(): void
    {
        $editor = $this->signIn(UserRole::Editor);
        $denied = ['message' => 'لا تملك صلاحية هذا الإجراء.'];

        $this->getJson('/admin/v1/settings')->assertForbidden()->assertExactJson($denied);
        // Refused before validation: an empty body still gets 403, not 422.
        $this->putJson('/admin/v1/settings', ['whatsapp_number' => 'x'])->assertForbidden();
        $this->getJson('/admin/v1/users')->assertForbidden()->assertExactJson($denied);
        $this->postJson('/admin/v1/users', [])->assertForbidden();
        $this->getJson("/admin/v1/users/{$editor->id}")->assertForbidden();
    }

    public function test_an_editor_manages_content_and_leads(): void
    {
        $this->signIn(UserRole::Editor);

        foreach (['projects', 'team', 'testimonials', 'clients', 'faqs', 'leads'] as $resource) {
            $this->getJson("/admin/v1/{$resource}")->assertOk();
        }
    }

    public function test_an_admin_reaches_everything(): void
    {
        $this->signIn(UserRole::Admin);

        $this->getJson('/admin/v1/settings')->assertOk();
        $this->getJson('/admin/v1/users')->assertOk();
    }

    public function test_a_guest_gets_401_on_content_routes(): void
    {
        $this->getJson('/admin/v1/projects')->assertUnauthorized()->assertExactJson(['message' => 'سجّل الدخول أولاً.']);
        $this->postJson('/admin/v1/faqs', [])->assertUnauthorized();
    }

    public function test_a_missing_item_is_an_arabic_404(): void
    {
        $this->signIn();

        $this->getJson('/admin/v1/projects/999')->assertNotFound()->assertExactJson(['message' => 'العنصر غير موجود.']);
        $this->getJson('/admin/v1/nothing-here')->assertNotFound()->assertExactJson(['message' => 'العنصر غير موجود.']);
        // The public API keeps its own wording.
        $this->getJson('/v1/projects/missing')->assertNotFound()->assertExactJson(['message' => 'Not found.']);
    }
}
