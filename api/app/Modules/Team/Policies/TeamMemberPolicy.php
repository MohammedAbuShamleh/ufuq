<?php

namespace App\Modules\Team\Policies;

use App\Models\User;
use App\Modules\Team\Models\TeamMember;

class TeamMemberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function view(User $user, TeamMember $member): bool
    {
        return $user->role->managesContent();
    }

    public function create(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function update(User $user, TeamMember $member): bool
    {
        return $user->role->managesContent();
    }

    public function delete(User $user, TeamMember $member): bool
    {
        return $user->role->managesContent();
    }

    public function reorder(User $user): bool
    {
        return $user->role->managesContent();
    }
}
