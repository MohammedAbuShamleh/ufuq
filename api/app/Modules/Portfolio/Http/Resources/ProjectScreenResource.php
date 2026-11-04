<?php

namespace App\Modules\Portfolio\Http\Resources;

use App\Modules\Portfolio\Models\ProjectScreen;
use App\Support\Media\MediaResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * file is null until the shot is uploaded from the dashboard.
 *
 * @mixin ProjectScreen
 */
class ProjectScreenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'kind' => $this->kind->value,
            'tab_key' => $this->tab_key,
            'tab_label' => $this->tab_label,
            'alt' => $this->alt,
            'file' => MediaResource::make($this->getFirstMedia('file')),
        ];
    }
}
