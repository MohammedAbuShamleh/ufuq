<?php

namespace App\Modules\Testimonials\Services;

use App\Modules\Testimonials\Models\Testimonial;
use Illuminate\Database\Eloquent\Collection;

class TestimonialFeed
{
    /** @return Collection<int, Testimonial> */
    public function published(): Collection
    {
        return Testimonial::published()->orderBy('sort_order')->get();
    }

    /** The testimonial a project page quotes, if its client has given one. */
    public function forProject(int $projectId): ?Testimonial
    {
        return Testimonial::published()
            ->where('project_id', $projectId)
            ->orderBy('sort_order')
            ->first();
    }
}
