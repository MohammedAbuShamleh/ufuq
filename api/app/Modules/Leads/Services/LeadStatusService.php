<?php

namespace App\Modules\Leads\Services;

use App\Modules\Leads\Enums\LeadStatus;
use App\Modules\Leads\Exceptions\InvalidLeadTransition;
use App\Modules\Leads\Models\Lead;

/** The only way a lead's status changes: new → contacted → closed. */
class LeadStatusService
{
    public function moveTo(Lead $lead, LeadStatus $next): Lead
    {
        if (! $lead->status->canTransitionTo($next)) {
            throw new InvalidLeadTransition($lead->status, $next);
        }

        $lead->forceFill(['status' => $next])->save();

        return $lead;
    }
}
