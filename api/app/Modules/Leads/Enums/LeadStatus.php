<?php

namespace App\Modules\Leads\Enums;

enum LeadStatus: string
{
    case New = 'new';
    case Contacted = 'contacted';
    case Closed = 'closed';

    public function canTransitionTo(self $next): bool
    {
        return match ($this) {
            self::New => $next === self::Contacted,
            self::Contacted => $next === self::Closed,
            self::Closed => false,
        };
    }
}
