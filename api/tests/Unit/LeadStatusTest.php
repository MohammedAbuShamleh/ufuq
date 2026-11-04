<?php

namespace Tests\Unit;

use App\Modules\Leads\Enums\LeadStatus;
use PHPUnit\Framework\TestCase;

class LeadStatusTest extends TestCase
{
    public function test_the_only_allowed_path_is_new_contacted_closed(): void
    {
        $allowed = [];

        foreach (LeadStatus::cases() as $from) {
            foreach (LeadStatus::cases() as $to) {
                if ($from->canTransitionTo($to)) {
                    $allowed[] = "{$from->value}->{$to->value}";
                }
            }
        }

        $this->assertSame(['new->contacted', 'contacted->closed'], $allowed);
    }
}
