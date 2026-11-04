<?php

namespace App\Modules\Portfolio\Http\Resources\Admin;

use App\Modules\Portfolio\Models\ProjectScreen;
use App\Support\Media\MediaResource;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ProjectScreen */
class ScreenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kind' => $this->kind->value,
            'label' => Translations::of($this->resource, 'label'),
            'alt' => Translations::of($this->resource, 'alt'),
            'sort_order' => $this->sort_order,
            'file' => MediaResource::make($this->getFirstMedia('file')),
        ];
    }
}
