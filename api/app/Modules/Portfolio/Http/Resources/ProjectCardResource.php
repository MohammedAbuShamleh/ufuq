<?php

namespace App\Modules\Portfolio\Http\Resources;

use App\Modules\Portfolio\Models\Project;
use App\Support\Translations;
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
            'summary' => $this->summary,
            'type' => $this->type->value,
            'sector' => $this->sector->value,
            'country' => $this->country,
            'tech_stack' => $this->tech_stack,
            'is_featured' => $this->is_featured,
            'featured_layout' => $this->featured_layout?->value,
            'featured_facts' => $this->featuredFacts(),
            'has_demo_data' => $this->has_demo_data,
            'facts' => ProjectFactResource::collection($this->whenLoaded('facts')),
            'highlights' => $this->whenLoaded('highlights', fn () => $this->highlights->pluck('text')),
            'screens' => ProjectScreenResource::collection($this->whenLoaded('screens')),
            'cover' => $this->whenLoaded('cover', fn () => ProjectScreenResource::make($this->cover)),
        ];
    }

    /** @return list<array{value: string, label: ?string}> labels in the request's locale, Arabic when missing */
    private function featuredFacts(): array
    {
        return array_map(fn (array $fact) => [
            'value' => $fact['value'],
            'label' => $fact['label'][app()->getLocale()] ?? $fact['label'][Translations::PRIMARY] ?? null,
        ], $this->featured_facts ?? []);
    }
}
