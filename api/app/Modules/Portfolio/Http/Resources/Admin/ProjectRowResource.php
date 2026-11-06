<?php

namespace App\Modules\Portfolio\Http\Resources\Admin;

use App\Modules\Portfolio\Models\Project;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * One line of the dashboard's project list. Needs cover.media and screens_count loaded.
 *
 * @mixin Project
 */
class ProjectRowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // The languages the site shows this item in (Arabic always; English once complete).
            'locales' => Translations::locales($this->resource, Project::REQUIRED_TEXT),
            'slug' => $this->slug,
            'title' => Translations::of($this->resource, 'title'),
            'client_name' => Translations::of($this->resource, 'client_name'),
            'tag' => Translations::of($this->resource, 'tag'),
            'type' => $this->type->value,
            'sector' => $this->sector->value,
            'status' => $this->status->value,
            'is_featured' => $this->is_featured,
            'featured_order' => $this->featured_order,
            'sort_order' => $this->sort_order,
            'cover' => ScreenResource::make($this->cover),
            'screens_count' => $this->screens_count,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
