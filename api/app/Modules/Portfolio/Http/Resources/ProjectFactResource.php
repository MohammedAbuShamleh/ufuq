<?php

namespace App\Modules\Portfolio\Http\Resources;

use App\Modules\Portfolio\Models\ProjectFact;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ProjectFact */
class ProjectFactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'value' => $this->value,
            'label' => $this->label,
        ];
    }
}
