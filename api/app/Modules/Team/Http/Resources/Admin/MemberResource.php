<?php

namespace App\Modules\Team\Http\Resources\Admin;

use App\Modules\Team\Models\TeamMember;
use App\Support\Media\MediaResource;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TeamMember */
class MemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // The languages the site shows this item in (Arabic always; English once complete).
            'locales' => Translations::locales($this->resource, TeamMember::REQUIRED_TEXT),
            'name' => Translations::of($this->resource, 'name'),
            'role' => Translations::of($this->resource, 'role'),
            'bio' => Translations::of($this->resource, 'bio'),
            'tech' => $this->tech,
            'is_founder' => $this->is_founder,
            'is_visible' => $this->is_visible,
            'sort_order' => $this->sort_order,
            'photo' => MediaResource::make($this->getFirstMedia('photo')),
        ];
    }
}
