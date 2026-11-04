<?php

namespace App\Support\Media;

use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Registers the webp widths on a model's image collection. Generated on upload
 * (not queued) so the dashboard can show the result straight away.
 */
trait HasWebpSizes
{
    protected function addWebpSizes(?Media $media, string $collection): void
    {
        if ($media !== null && ! WebpSizes::isRasterImage($media->mime_type)) {
            return;
        }

        // Without the image extension a conversion would fail the whole upload.
        // The original is still stored and the site falls back to it when sizes is [].
        // The driver names (gd, imagick) are also the PHP extension names.
        if (! extension_loaded((string) config('media-library.image_driver', 'gd'))) {
            return;
        }

        foreach (WebpSizes::WIDTHS as $width) {
            $this->addMediaConversion("w{$width}")
                ->fit(Fit::Max, $width, $width * 4)
                ->format('webp')
                ->performOnCollections($collection)
                ->nonQueued();
        }
    }
}
