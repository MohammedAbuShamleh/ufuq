<?php

namespace App\Modules\Testimonials\Policies;

use App\Models\User;
use App\Modules\Testimonials\Models\Testimonial;

class TestimonialPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function view(User $user, Testimonial $testimonial): bool
    {
        return $user->role->managesContent();
    }

    public function create(User $user): bool
    {
        return $user->role->managesContent();
    }

    public function update(User $user, Testimonial $testimonial): bool
    {
        return $user->role->managesContent();
    }

    public function delete(User $user, Testimonial $testimonial): bool
    {
        return $user->role->managesContent();
    }

    public function reorder(User $user): bool
    {
        return $user->role->managesContent();
    }
}
