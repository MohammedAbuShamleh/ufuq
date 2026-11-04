<?php

namespace App\Modules\Team\Http\Resources;

use App\Modules\Team\Models\TeamMember;
use App\Support\Media\MediaResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TeamMember */
class TeamMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'role' => $this->role,
            'bio' => $this->bio,
            'tech' => $this->tech,
            'is_founder' => $this->is_founder,
            'photo' => MediaResource::make($this->getFirstMedia('photo')),
        ];
    }
}
