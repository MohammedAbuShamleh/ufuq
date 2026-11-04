<?php

namespace App\Modules\Clients\Http\Resources\Admin;

use App\Modules\Clients\Models\Client;
use App\Support\Media\MediaResource;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Client */
class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => Translations::of($this->resource, 'name'),
            'sector_label' => Translations::of($this->resource, 'sector_label'),
            'location' => Translations::of($this->resource, 'location'),
            'is_visible' => $this->is_visible,
            'sort_order' => $this->sort_order,
            'logo' => MediaResource::make($this->getFirstMedia('logo')),
        ];
    }
}
