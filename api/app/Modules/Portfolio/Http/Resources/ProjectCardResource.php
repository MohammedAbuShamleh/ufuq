<?php

namespace App\Modules\Portfolio\Http\Resources;

use App\Modules\Portfolio\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A project as a card. Featured cards load facts, highlights and screens; list
 * cards load only the cover. Whatever was not loaded is left out.
 *
 * @mixin Project
 */
class ProjectCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'client_name' => $this->client_name,
            'tag' => $this->tag,
            'frame_label' => $this->frame_label,
            'summary' => $this->summary,
            'type' => $this->type->value,
            'sector' => $this->sector->value,
            'country' => $this->country,
            'tech_stack' => $this->tech_stack,
            'is_featured' => $this->is_featured,
            'card_theme' => $this->card_theme?->value,
            'has_demo_data' => $this->has_demo_data,
            'facts' => ProjectFactResource::collection($this->whenLoaded('facts')),
            'highlights' => $this->whenLoaded('highlights', fn () => $this->highlights->pluck('text')),
            'screens' => ProjectScreenResource::collection($this->whenLoaded('screens')),
            'cover' => $this->whenLoaded('cover', fn () => ProjectScreenResource::make($this->cover)),
        ];
    }
}
