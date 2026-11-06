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
            'locales' => Translations::locales($this->resource, Project::REQUIRED_TEXT),
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
            // Outside Arabic a fact or highlight without its text is left out, not shown empty.
            'facts' => ProjectFactResource::collection($this->whenLoaded('facts', fn () => $this->facts->filter(fn ($fact) => filled($fact->label))->values())),
            'highlights' => $this->whenLoaded('highlights', fn () => $this->highlights->pluck('text')->filter(fn ($text) => filled($text))->values()),
            'screens' => ProjectScreenResource::collection($this->whenLoaded('screens')),
            'cover' => $this->whenLoaded('cover', fn () => ProjectScreenResource::make($this->cover)),
        ];
    }

    /**
     * Labels in the request's locale. In Arabic a missing label stays null (pending);
     * in another language the fact is left out, as with every untranslated text.
     *
     * @return list<array{value: string, label: ?string}>
     */
    private function featuredFacts(): array
    {
        $locale = app()->getLocale();
        $facts = array_map(fn (array $fact) => [
            'value' => $fact['value'],
            'label' => $fact['label'][$locale] ?? null,
        ], $this->featured_facts ?? []);

        return $locale === Translations::PRIMARY
            ? $facts
            : array_values(array_filter($facts, fn (array $fact) => filled($fact['label'])));
    }
}
