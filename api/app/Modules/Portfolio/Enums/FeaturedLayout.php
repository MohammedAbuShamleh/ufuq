<?php

namespace App\Modules\Portfolio\Enums;

/** How a featured project is laid out in «أعمالنا» (v8: one composition per project). */
enum FeaturedLayout: string
{
    /** A main desktop screen with every desktop screen as a thumbnail under it. */
    case Showcase = 'showcase';

    /** A dark band with the first three phone screens. */
    case Phones = 'phones';

    /** Copy and bullets over a grid of desktop screens that open full size. */
    case Sheet = 'sheet';

    /** A wide stage that plays the videos, one chip per screen. */
    case Reel = 'reel';
}
