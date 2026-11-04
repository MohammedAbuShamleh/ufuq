<?php

namespace App\Modules\Clients\Http\Resources;

use App\Modules\Clients\Models\Client;
use App\Support\Media\MediaResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Client */
class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'sector_label' => $this->sector_label,
            'location' => $this->location,
            'logo' => MediaResource::make($this->getFirstMedia('logo')),
        ];
    }
}
