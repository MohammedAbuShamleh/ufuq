<?php

namespace App\Modules\Leads\Events;

use App\Modules\Leads\Models\Lead;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/** A visitor sent the contact form. The mail notice listens for this (queued). */
class LeadReceived
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly Lead $lead) {}
}
