<?php

namespace App\Modules\Portfolio\Http\Controllers;

use App\Modules\Portfolio\Http\Resources\ProjectResource;
use App\Modules\Portfolio\Services\ProjectCatalog;
use App\Modules\Testimonials\Services\TestimonialFeed;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class ShowProjectController
{
    public function __invoke(string $slug, ProjectCatalog $catalog, TestimonialFeed $testimonials, PublicCache $cache): JsonResponse
    {
        return $cache->respond("project:{$slug}", function () use ($slug, $catalog, $testimonials) {
            $project = $catalog->findPublishedBySlug($slug);

            // Testimonials own their table; the project only borrows the quote for display.
            $project->setRelation('testimonial', $testimonials->forProject($project->id));

            return ProjectResource::make($project);
        });
    }
}
