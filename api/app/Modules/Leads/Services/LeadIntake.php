<?php

namespace App\Modules\Leads\Services;

use App\Modules\Leads\Events\LeadReceived;
use App\Modules\Leads\Models\Lead;

class LeadIntake
{
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

        $lead = Lead::create([
            ...collect($data)->except('website')->all(),
            // A keyed hash lets us spot repeat senders without keeping their address.
            'ip_hash' => hash_hmac('sha256', (string) $ip, (string) config('app.key')),
        ]);

        LeadReceived::dispatch($lead);

        return $lead;
    }
}
