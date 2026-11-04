<?php

namespace App\Support\Media;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * One uploaded file: its original URL and size, plus the webp widths when it
 * is an image. Width and height let the site reserve space before loading.
 *
 * @mixin Media
 */
class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'url' => $this->getFullUrl(),
            'mime' => $this->mime_type,
            'width' => $this->getCustomProperty('width'),
            'height' => $this->getCustomProperty('height'),
            'sizes' => $this->webpSizes(),
        ];
    }

    /** @return list<array{width: int, url: string}> */
    private function webpSizes(): array
    {
        $sizes = [];

        foreach (WebpSizes::WIDTHS as $width) {
            if ($this->hasGeneratedConversion("w{$width}")) {
                $sizes[] = ['width' => $width, 'url' => $this->getFullUrl("w{$width}")];
            }
        }

        return $sizes;
    }
}
