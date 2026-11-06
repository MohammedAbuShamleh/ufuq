<?php

namespace App\Modules\Portfolio\Http\Resources\Admin;

use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Models\ProjectFact;
use App\Modules\Portfolio\Models\ProjectHighlight;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The whole project as the edit form binds it. Needs facts, highlights and screens.media loaded.
 *
 * @mixin Project
 */
class ProjectResource extends JsonResource
{
    private const TEXT = ['title', 'client_name', 'summary', 'tag', 'challenge', 'solution', 'results'];

    public function toArray(Request $request): array
    {
        $text = [];

        foreach (self::TEXT as $attribute) {
            $text[$attribute] = Translations::of($this->resource, $attribute);
        }

        return [
            'id' => $this->id,
            // The languages the site shows this item in (Arabic always; English once complete).
            'locales' => Translations::locales($this->resource, Project::REQUIRED_TEXT),
            'slug' => $this->slug,
            ...$text,
            'type' => $this->type->value,
            'sector' => $this->sector->value,
            'country' => $this->country,
            'tech_stack' => $this->tech_stack ?? [],
            'is_featured' => $this->is_featured,
            'featured_order' => $this->featured_order,
            'featured_layout' => $this->featured_layout?->value,
            'featured_facts' => array_map(fn (array $fact) => [
                'value' => $fact['value'],
                'label' => Translations::normalize($fact['label']),
            ], $this->featured_facts ?? []),
            'has_demo_data' => $this->has_demo_data,
            'status' => $this->status->value,
            'published_at' => $this->published_at?->toIso8601String(),
            'sort_order' => $this->sort_order,
            'facts' => $this->facts->map(fn (ProjectFact $fact) => [
                'id' => $fact->id,
                'value' => $fact->value,
                'label' => Translations::of($fact, 'label'),
            ])->all(),
            'highlights' => $this->highlights->map(fn (ProjectHighlight $highlight) => [
                'id' => $highlight->id,
                'text' => Translations::of($highlight, 'text'),
            ])->all(),
            'screens' => ScreenResource::collection($this->screens),
        ];
    }
}
