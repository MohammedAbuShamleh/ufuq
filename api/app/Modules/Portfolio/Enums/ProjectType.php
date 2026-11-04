<?php

namespace App\Modules\Portfolio\Enums;

enum ProjectType: string
{
    case System = 'system';
    case Website = 'website';
    case Platform = 'platform';
    case App = 'app';
}
