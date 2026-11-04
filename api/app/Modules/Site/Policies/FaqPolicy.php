<?php

namespace App\Modules\Site\Policies;

use App\Models\User;
use App\Modules\Site\Models\Faq;

class FaqPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function view(User $user, Faq $faq): bool
    {
        return $user->role->managesContent();
    }

    public function create(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function update(User $user, Faq $faq): bool
    {
        return $user->role->managesContent();
    }

    public function delete(User $user, Faq $faq): bool
    {
        return $user->role->managesContent();
    }

    public function reorder(User $user): bool
    {
        return $user->role->managesContent();
    }
}
