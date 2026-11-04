<?php

namespace App\Support\Media;

/** The three webp widths the site builds its srcset from, shared by upload and output. */
final class WebpSizes
{
    public const WIDTHS = [480, 960, 1600];

    /** SVG and PDF stay as uploaded; only bitmaps get resized copies and dimensions. */
    public static function isRasterImage(?string $mime): bool
    {
        return str_starts_with((string) $mime, 'image/') && $mime !== 'image/svg+xml';
    }
}
