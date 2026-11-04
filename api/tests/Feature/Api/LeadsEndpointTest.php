<?php

namespace Tests\Feature\Api;

use App\Modules\Leads\Enums\LeadStatus;
use App\Modules\Leads\Events\LeadReceived;
use App\Modules\Leads\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class LeadsEndpointTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([LeadReceived::class]);
    }

    public function test_a_visitor_message_is_stored_and_announced(): void
    {
        $this->postJson('/v1/leads', [
            'name' => 'أحمد',
            'contact' => 'ahmad@example.com',
            'project_type' => 'نظام ERP',
            'message' => 'نريد نظاماً للمدرسة.',
            'source_page' => '/contact',
        ])->assertCreated()->assertExactJson(['data' => ['received' => true]]);

        $lead = Lead::sole();
        $this->assertSame('ahmad@example.com', $lead->contact);
        $this->assertSame(LeadStatus::New, $lead->status);
        $this->assertSame(64, strlen($lead->ip_hash));
        $this->assertNotSame('127.0.0.1', $lead->ip_hash);

        Event::assertDispatched(LeadReceived::class, fn (LeadReceived $event) => $event->lead->is($lead));
    }

    public function test_a_phone_typed_in_arabic_digits_is_accepted_and_normalised(): void
    {
        $this->postJson('/v1/leads', ['name' => 'سارة', 'contact' => '+٩٧٠ ٥٩٩ ١٢٣ ٤٥٦'])->assertCreated();

        $this->assertSame('+970 599 123 456', Lead::sole()->contact);
    }

    public function test_the_honeypot_answers_like_success_but_stores_nothing(): void
    {
        $this->postJson('/v1/leads', [
            'name' => 'bot',
            'contact' => 'bot@example.com',
            'website' => 'https://spam.example',
        ])->assertCreated()->assertExactJson(['data' => ['received' => true]]);

        $this->assertSame(0, Lead::count());
        Event::assertNotDispatched(LeadReceived::class);
    }

    public function test_invalid_input_gets_arabic_messages(): void
    {
        $this->postJson('/v1/leads', ['name' => '', 'contact' => 'not a contact'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name' => 'اكتب اسمك.',
                'contact' => 'اكتب بريداً صحيحاً أو رقم جوال.',
            ]);

        $this->assertSame(0, Lead::count());
    }

    public function test_a_sender_is_limited_to_five_messages_a_minute(): void
    {
        foreach (range(1, 5) as $i) {
            $this->postJson('/v1/leads', ['name' => "زائر {$i}", 'contact' => '0599123456'])->assertCreated();
        }

        $this->postJson('/v1/leads', ['name' => 'زائر 6', 'contact' => '0599123456'])->assertTooManyRequests();
        $this->assertSame(5, Lead::count());
    }

    public function test_status_cannot_be_set_from_the_form(): void
    {
        $this->postJson('/v1/leads', ['name' => 'أحمد', 'contact' => 'ahmad@example.com', 'status' => 'closed'])
            ->assertCreated();

        $this->assertSame(LeadStatus::New, Lead::sole()->status);
    }
}
