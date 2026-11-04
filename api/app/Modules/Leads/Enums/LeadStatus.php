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

    /** The one step forward, derived from canTransitionTo so the two never disagree. */
    public function next(): ?self
    {
        foreach (self::cases() as $case) {
            if ($this->canTransitionTo($case)) {
                return $case;
            }
        }

        return null;
    }

    /** How the dashboard names the status in messages. */
    public function label(): string
    {
        return match ($this) {
            self::New => 'جديدة',
            self::Contacted => 'تم التواصل',
            self::Closed => 'مغلقة',
        };
    }
}
