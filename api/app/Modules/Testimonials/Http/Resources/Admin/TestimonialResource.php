<?php

namespace App\Modules\Testimonials\Http\Resources\Admin;

use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Needs the `project` relation set by TestimonialEditor (id and title only).
 *
 * @mixin Testimonial
 */
class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $project = $this->resource->getRelation('project');

        return [
            'id' => $this->id,
            // The languages the site shows this item in (Arabic always; English once complete).
            'locales' => Translations::locales($this->resource, Testimonial::REQUIRED_TEXT),
            'project_id' => $this->project_id,
            'project' => $project === null ? null : [
                'id' => $project->id,
                'title' => Translations::of($project, 'title'),
            ],
            'quote' => Translations::of($this->resource, 'quote'),
            'author_name' => Translations::of($this->resource, 'author_name'),
            'author_title' => Translations::of($this->resource, 'author_title'),
            'organization' => Translations::of($this->resource, 'organization'),
            'status' => $this->status->value,
            'sort_order' => $this->sort_order,
        ];
    }
}
