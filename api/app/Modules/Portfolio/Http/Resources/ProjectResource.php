<?php

namespace App\Modules\Portfolio\Http\Resources;

use App\Modules\Testimonials\Http\Resources\TestimonialResource;
use Illuminate\Http\Request;

/**
 * The project page: the card plus the story and the client's testimonial.
 * Story fields are null while the text is still pending.
 */
class ProjectResource extends ProjectCardResource
{
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'challenge' => $this->challenge,
            'solution' => $this->solution,
            'results' => $this->results,
            'testimonial' => $this->whenLoaded('testimonial', fn () => TestimonialResource::make($this->testimonial)),
        ];
    }
}
