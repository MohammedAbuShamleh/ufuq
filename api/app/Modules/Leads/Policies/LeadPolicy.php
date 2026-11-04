<?php

namespace App\Modules\Leads\Policies;

use App\Models\User;
use App\Modules\Leads\Models\Lead;

/** Contact messages: read and moved along their status. Never edited or deleted. */
class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function view(User $user, Lead $lead): bool
    {
        return $user->role->managesContent();
    }

    public function changeStatus(User $user, Lead $lead): bool
    {
        return $user->role->managesContent();
    }
}
