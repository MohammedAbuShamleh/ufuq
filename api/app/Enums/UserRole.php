<?php

namespace App\Enums;

enum UserRole: string
{
    // Everything, including settings and user management.
    case Admin = 'admin';
    // Content and contact messages only.
    case Editor = 'editor';

    /** Projects (with screens), team, testimonials, clients, FAQs and leads. */
    public function managesContent(): bool
    {
        return in_array($this, [self::Admin, self::Editor], true);
    }

    /** Site settings and user accounts. */
    public function managesSite(): bool
    {
        return $this === self::Admin;
    }
}
