<?php

namespace App\Modules\Portfolio\Enums;

enum ProjectType: string
{
    case System = 'system';
    case Finance = 'finance';
    case Website = 'website';
    case Platform = 'platform';
    case App = 'app';
}
