<?php

namespace App\Enums;

enum UserRole: string
{
    // Everything, including settings and user management.
    case Admin = 'admin';
    // Content and contact messages only.
    case Editor = 'editor';
}
