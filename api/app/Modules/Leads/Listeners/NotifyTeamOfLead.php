<?php

namespace App\Modules\Leads\Listeners;

use App\Modules\Leads\Events\LeadReceived;
use App\Modules\Leads\Mail\NewLeadMail;
use App\Modules\Site\Services\SiteSettings;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Emails a new contact-form message to the address in the dashboard's
 * settings («بريد التواصل»). Queued: the visitor gets their answer without
 * waiting on the mail server, and a mail server hiccup is retried.
 */
class NotifyTeamOfLead implements ShouldQueue
{
    public int $tries = 3;

    /** @return list<int> seconds before each retry */
    public function backoff(): array
    {
        return [60, 300];
    }

    public function __construct(private readonly SiteSettings $site) {}

    public function handle(LeadReceived $event): void
    {
        $to = $this->site->contactEmail();

        if ($to === null) {
            // The message is safe in the dashboard either way; only the notice is skipped.
            Log::warning('A contact-form message was not emailed: no contact email in the settings.', ['lead' => $event->lead->id]);

            return;
        }

        Mail::to($to)->send(new NewLeadMail($event->lead));
    }
}
