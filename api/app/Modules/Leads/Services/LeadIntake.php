<?php

namespace App\Modules\Leads\Services;

use App\Modules\Leads\Events\LeadReceived;
use App\Modules\Leads\Models\Lead;

class LeadIntake
{
    private const REPEAT_WINDOW_MINUTES = 10;

    /**
     * Store a contact-form message and announce it. A filled honeypot means a
     * bot: nothing is stored, and the caller answers exactly as for a person
     * so the bot learns nothing.
     *
     * @param  array{name: string, contact: string, project_type?: ?string, message?: ?string, source_page?: ?string, website?: ?string}  $data
     */
    public function receive(array $data, ?string $ip): ?Lead
    {
        if (filled($data['website'] ?? null)) {
            return null;
        }

        // A keyed hash lets us spot repeat senders without keeping their address.
        $ipHash = hash_hmac('sha256', (string) $ip, (string) config('app.key'));

        // A double click, or a resend after a slow answer: one lead and one email, not two.
        $repeat = Lead::query()
            ->where('ip_hash', $ipHash)
            ->where('name', $data['name'])
            ->where('contact', $data['contact'])
            ->where('message', $data['message'] ?? null)
            ->where('created_at', '>=', now()->subMinutes(self::REPEAT_WINDOW_MINUTES))
            ->first();

        if ($repeat) {
            return $repeat;
        }

        $lead = Lead::create([...collect($data)->except('website')->all(), 'ip_hash' => $ipHash]);

        LeadReceived::dispatch($lead);

        return $lead;
    }
}
