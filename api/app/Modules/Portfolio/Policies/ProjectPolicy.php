<?php

namespace App\Modules\Portfolio\Policies;

use App\Models\User;
use App\Modules\Portfolio\Models\Project;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function view(User $user, Project $project): bool
    {
        return $user->role->managesContent();
    }

    public function create(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function update(User $user, Project $project): bool
    {
        return $user->role->managesContent();
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->role->managesContent();
    }

    public function reorder(User $user): bool
    {
        return $user->role->managesContent();
    }
}
