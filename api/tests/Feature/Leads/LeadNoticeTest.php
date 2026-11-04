<?php

namespace Tests\Feature\Leads;

use App\Modules\Leads\Listeners\NotifyTeamOfLead;
use App\Modules\Leads\Mail\NewLeadMail;
use App\Modules\Leads\Models\Lead;
use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Setting;
use Illuminate\Events\CallQueuedListener;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class LeadNoticeTest extends TestCase
{
    use RefreshDatabase;

    private const MESSAGE = [
        'name' => 'أبو خالد',
        'contact' => 'abu.khaled@example.com',
        'project_type' => 'نظام',
        'message' => "نريد نظاماً للكفالات.\nعندنا ٣٠٠ يتيم.",
        'source_page' => '/work/saiid',
    ];

    public function test_a_message_is_emailed_to_the_contact_address(): void
    {
        Mail::fake();
        $this->setContactEmail('hello@ufuq.ps');

        $this->postJson('/v1/leads', self::MESSAGE)->assertCreated();

        // Replying to the notice answers the visitor directly.
        Mail::assertSent(NewLeadMail::class, fn (NewLeadMail $mail) => $mail->hasTo('hello@ufuq.ps')
            && $mail->hasReplyTo('abu.khaled@example.com')
            && $mail->lead->is(Lead::sole()));
    }

    public function test_the_notice_is_queued_so_the_visitor_never_waits_on_mail(): void
    {
        Queue::fake();

        $this->postJson('/v1/leads', self::MESSAGE)->assertCreated();

        Queue::assertPushed(CallQueuedListener::class, fn (CallQueuedListener $job) => $job->class === NotifyTeamOfLead::class);
    }

    public function test_without_a_contact_address_the_message_is_kept_but_not_emailed(): void
    {
        Mail::fake();

        $this->postJson('/v1/leads', self::MESSAGE)->assertCreated();

        Mail::assertNothingSent();
        $this->assertSame(1, Lead::count());
    }

    public function test_the_notice_shows_the_message_and_ways_to_answer(): void
    {
        $lead = Lead::create([...self::MESSAGE, 'contact' => '0599 123 456', 'ip_hash' => str_repeat('a', 64)]);
        config(['services.dashboard.url' => 'https://admin.ufuq.test/']);

        $mail = new NewLeadMail($lead);

        $mail->assertHasSubject('رسالة جديدة من الموقع: أبو خالد');
        $mail->assertSeeInHtml('عندنا ٣٠٠ يتيم.');
        $mail->assertSeeInHtml('https://wa.me/970599123456');
        $mail->assertSeeInHtml("https://admin.ufuq.test/leads/{$lead->id}");
        $mail->assertSeeInText('نوع المشروع: نظام');
        // A phone number is no address to reply to.
        $this->assertFalse($mail->hasReplyTo('0599 123 456'));
    }

    public function test_a_repeated_send_is_kept_and_emailed_once(): void
    {
        Mail::fake();
        $this->setContactEmail('hello@ufuq.ps');

        $this->postJson('/v1/leads', self::MESSAGE)->assertCreated();
        $this->postJson('/v1/leads', self::MESSAGE)->assertCreated();
        $this->postJson('/v1/leads', [...self::MESSAGE, 'message' => 'ونريد أيضاً تطبيقاً.'])->assertCreated();

        $this->assertSame(2, Lead::count());
        Mail::assertSentCount(2);

        // The same message much later is a new lead.
        $this->travel(11)->minutes();
        $this->postJson('/v1/leads', self::MESSAGE)->assertCreated();
        $this->assertSame(3, Lead::count());
    }

    private function setContactEmail(string $email): void
    {
        Setting::create(['key' => SettingKey::ContactEmail, 'value' => $email]);
    }
}
