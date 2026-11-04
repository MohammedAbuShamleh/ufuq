<?php

namespace App\Http\Resources;

use App\Modules\Clients\Http\Resources\ClientResource;
use App\Modules\Portfolio\Http\Resources\ProjectCardResource;
use App\Modules\Site\Http\Resources\FaqResource;
use App\Modules\Site\Http\Resources\SettingsResource;
use App\Modules\Team\Http\Resources\TeamMemberResource;
use App\Modules\Testimonials\Http\Resources\TestimonialResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Everything the home page renders, in one response, built from each module's own resources. */
class HomeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'featured' => ProjectCardResource::collection($this->resource['featured']),
            'projects' => ProjectCardResource::collection($this->resource['projects']),
            'clients' => ClientResource::collection($this->resource['clients']),
            'testimonials' => TestimonialResource::collection($this->resource['testimonials']),
            'team' => TeamMemberResource::collection($this->resource['team']),
            'faqs' => FaqResource::collection($this->resource['faqs']),
            'settings' => SettingsResource::make($this->resource['settings']),
        ];
    }
}
