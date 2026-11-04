<?php

namespace App\Modules\Admin\Policies;

use App\Models\User;

/** Accounts are admin-only. Self and last-admin guards are rules, not roles: see UserManager. */
class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role->managesSite();
    }

    public function view(User $user, User $account): bool
    {
        return $user->role->managesSite();
    }

    public function create(User $user): bool
    {
        return $user->role->managesSite();
    }

    public function update(User $user, User $account): bool
    {
        return $user->role->managesSite();
    }

    public function delete(User $user, User $account): bool
    {
        return $user->role->managesSite();
    }
}
