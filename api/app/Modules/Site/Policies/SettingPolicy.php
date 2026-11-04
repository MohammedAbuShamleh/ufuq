<?php

namespace App\Modules\Site\Policies;

use App\Models\User;

/** Site-wide settings (contact details, legal text, the profile PDF) are admin-only. */
class SettingPolicy
{
    public function view(User $user): bool
    {
        return $user->role->managesSite();
    }

    public function update(User $user): bool
    {
        return $user->role->managesSite();
    }
}
