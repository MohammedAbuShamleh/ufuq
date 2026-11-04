<?php

namespace App\Support\Media;

use Spatie\MediaLibrary\MediaCollections\Events\MediaHasBeenAddedEvent;

/**
 * Stores the original width and height on every uploaded image, so the API can
 * return them without opening the file again.
 */
class RecordImageDimensions
{
    public function handle(MediaHasBeenAddedEvent $event): void
    {
        $media = $event->media;
        $path = $media->getPath();

        if (! WebpSizes::isRasterImage($media->mime_type) || ! is_file($path)) {
            return;
        }

        $size = getimagesize($path);

        if ($size === false) {
            return;
        }

        $media->setCustomProperty('width', $size[0])
            ->setCustomProperty('height', $size[1])
            ->saveQuietly();
    }
}
