<?php

namespace App\Modules\Portfolio\Policies;

use App\Models\User;
use App\Modules\Portfolio\Models\ProjectScreen;

/** Screens are edited from their project's page, by whoever may edit projects. */
class ProjectScreenPolicy
{
    public function create(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function update(User $user, ProjectScreen $screen): bool
    {
        return $user->role->managesContent();
    }

    public function delete(User $user, ProjectScreen $screen): bool
    {
        return $user->role->managesContent();
    }

    public function reorder(User $user): bool
    {
        return $user->role->managesContent();
    }
}
