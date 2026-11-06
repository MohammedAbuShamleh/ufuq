<?php

namespace App\Modules\Site\Http\Resources\Admin;

use App\Modules\Site\Models\Faq;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Faq */
class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // The languages the site shows this item in (Arabic always; English once complete).
            'locales' => Translations::locales($this->resource, Faq::REQUIRED_TEXT),
            'question' => Translations::of($this->resource, 'question'),
            'answer' => Translations::of($this->resource, 'answer'),
            'is_visible' => $this->is_visible,
            'sort_order' => $this->sort_order,
        ];
    }
}
