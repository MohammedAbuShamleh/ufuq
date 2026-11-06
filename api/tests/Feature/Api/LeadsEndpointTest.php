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

    public function test_only_the_site_origin_may_post_from_a_browser(): void
    {
        config(['cors.allowed_origins' => ['https://ufuq.ps']]);

        $preflight = fn (string $origin) => $this->call('OPTIONS', '/v1/leads', server: [
            'HTTP_ORIGIN' => $origin,
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
        ]);

        $preflight('https://ufuq.ps')->assertHeader('Access-Control-Allow-Origin', 'https://ufuq.ps');
        // Any other site gets ufuq.ps back (or nothing), which its browser refuses.
        $this->assertNotSame(
            'https://evil.example',
            $preflight('https://evil.example')->headers->get('Access-Control-Allow-Origin'),
        );
    }

    public function test_status_cannot_be_set_from_the_form(): void
    {
        $this->postJson('/v1/leads', ['name' => 'أحمد', 'contact' => 'ahmad@example.com', 'status' => 'closed'])
            ->assertCreated();

        $this->assertSame(LeadStatus::New, Lead::sole()->status);
    }

    public function test_a_message_from_the_english_site_is_marked_english(): void
    {
        $this->postJson('/v1/leads', ['name' => 'Sam', 'contact' => 'sam@example.com', 'locale' => 'en'])->assertCreated();
        $this->postJson('/v1/leads?lang=en', ['name' => 'Lee', 'contact' => 'lee@example.com'])->assertCreated();
        $this->postJson('/v1/leads', ['name' => 'سارة', 'contact' => 'sara@example.com', 'locale' => 'fr'])->assertCreated();

        $this->assertSame(['en', 'en', 'ar'], Lead::orderBy('id')->pluck('locale')->all());
    }

    public function test_the_english_site_gets_its_errors_in_english(): void
    {
        $this->postJson('/v1/leads', ['name' => '', 'contact' => 'not a contact', 'locale' => 'en'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name' => 'Please write your name.',
                'contact' => 'Write a valid email or phone number.',
            ]);

        $this->postJson('/v1/leads', ['name' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name' => 'اكتب اسمك.']);
    }
}
