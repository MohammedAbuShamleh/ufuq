<?php

namespace App\Modules\Testimonials;

use App\Modules\Testimonials\Models\Testimonial;
use App\Modules\Testimonials\Policies\TestimonialPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class TestimonialsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Models live outside App\Models, so policy auto-discovery would miss them.
        Gate::policy(Testimonial::class, TestimonialPolicy::class);
    }
}
