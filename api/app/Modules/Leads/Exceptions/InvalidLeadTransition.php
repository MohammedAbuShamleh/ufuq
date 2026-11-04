<?php

namespace App\Modules\Leads\Exceptions;

use App\Modules\Leads\Enums\LeadStatus;
use DomainException;

class InvalidLeadTransition extends DomainException
{
    public function __construct(public readonly LeadStatus $from, public readonly LeadStatus $to)
    {
        parent::__construct("A lead cannot move from {$from->value} to {$to->value}.");
    }
}
