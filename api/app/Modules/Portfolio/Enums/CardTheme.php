<?php

namespace App\Modules\Portfolio\Enums;

// Background of a featured project card, matching the four v7 cards.
enum CardTheme: string
{
    case Linen = 'linen';
    case Ink = 'ink';
    case Sand = 'sand';
    case Charcoal = 'charcoal';
}
