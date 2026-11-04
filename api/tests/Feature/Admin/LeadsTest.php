<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Modules\Leads\Enums\LeadStatus;
use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Services\WhatsappLink;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class LeadsTest extends TestCase
{
    use RefreshDatabase, UsesDashboard;

    protected function setUp(): void
    {
        parent::setUp();

        $this->signIn(UserRole::Editor);
    }

    public function test_the_inbox_is_newest_first_with_counts_per_status(): void
    {
        Carbon::setTestNow('2026-11-01 09:00:00');
        $old = $this->makeLead(['contact' => 'old@example.com']);
        Carbon::setTestNow('2026-11-03 09:00:00');
        $new = $this->makeLead(['contact' => '0599123456']);
        $this->makeLead([], LeadStatus::Contacted);
        Carbon::setTestNow();

        $this->getJson('/admin/v1/leads')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.contact', fn ($contact) => $contact !== 'old@example.com')
            ->assertJsonPath('data.2.id', $old->id)
            ->assertJsonPath('meta', ['current_page' => 1, 'last_page' => 1, 'per_page' => 20, 'total' => 3])
            ->assertJsonPath('counts', ['new' => 2, 'contacted' => 1, 'closed' => 0])
            ->assertJsonMissingPath('links');

        $this->getJson('/admin/v1/leads?status=new')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $new->id)
            ->assertJsonPath('data.0.status', 'new')
            ->assertJsonPath('data.0.next_status', 'contacted')
            ->assertJsonPath('data.0.whatsapp_url', 'https://wa.me/970599123456')
            ->assertJsonPath('data.1.whatsapp_url', null)
            ->assertJsonPath('data.0.created_at', '2026-11-03T09:00:00+00:00')
            ->assertJsonPath('counts.new', 2);

        $this->getJson('/admin/v1/leads?status=lost')->assertUnprocessable()->assertJsonValidationErrors('status');
    }

    public function test_the_inbox_pages_by_twenty(): void
    {
        foreach (range(1, 21) as $i) {
            $this->makeLead();
        }

        $this->getJson('/admin/v1/leads?page=2')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.total', 21);
    }

    public function test_whatsapp_links_are_built_from_phone_numbers(): void
    {
        $this->assertSame('https://wa.me/970599123456', WhatsappLink::forContact('+970 599 123 456'));
        $this->assertSame('https://wa.me/970599123456', WhatsappLink::forContact('00970-599-123-456'));
        $this->assertSame('https://wa.me/970599123456', WhatsappLink::forContact('0599 123 456'));
        $this->assertSame('https://wa.me/201001234567', WhatsappLink::forContact('201001234567'));
        $this->assertNull(WhatsappLink::forContact('ahmad@example.com'));
        $this->assertNull(WhatsappLink::forContact('123'));
    }

    public function test_a_lead_moves_one_step_forward(): void
    {
        $lead = $this->makeLead();

        $this->patchJson("/admin/v1/leads/{$lead->id}/status", ['status' => 'contacted'])
            ->assertOk()
            ->assertJsonPath('data.status', 'contacted')
            ->assertJsonPath('data.next_status', 'closed');

        $this->patchJson("/admin/v1/leads/{$lead->id}/status", ['status' => 'closed'])
            ->assertOk()
            ->assertJsonPath('data.next_status', null);

        $this->getJson("/admin/v1/leads/{$lead->id}")->assertOk()->assertJsonPath('data.status', 'closed');
    }

    public function test_a_refused_transition_is_a_422_on_status(): void
    {
        $lead = $this->makeLead();

        $this->patchJson("/admin/v1/leads/{$lead->id}/status", ['status' => 'closed'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status' => 'الرسالة حالتها «جديدة»، ولا يمكن نقلها إلى «مغلقة».']);

        $this->assertSame(LeadStatus::New, $lead->fresh()->status);
    }

    private function makeLead(array $attributes = [], LeadStatus $status = LeadStatus::New): Lead
    {
        $lead = Lead::create([
            'name' => 'أحمد',
            'contact' => 'ahmad@example.com',
            'ip_hash' => str_repeat('a', 64),
            ...$attributes,
        ]);

        $lead->forceFill(['status' => $status])->save();

        return $lead;
    }
}
