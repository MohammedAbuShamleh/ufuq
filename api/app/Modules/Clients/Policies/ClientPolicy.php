<?php

namespace App\Modules\Clients\Policies;

use App\Models\User;
use App\Modules\Clients\Models\Client;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function view(User $user, Client $client): bool
    {
        return $user->role->managesContent();
    }

    public function create(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function update(User $user, Client $client): bool
    {
        return $user->role->managesContent();
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->role->managesContent();
    }

    public function reorder(User $user): bool
    {
        return $user->role->managesContent();
    }
}
