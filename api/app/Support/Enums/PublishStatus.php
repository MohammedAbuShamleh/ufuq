<?php

namespace App\Support\Enums;

// Shared by Portfolio (projects) and Testimonials.
enum PublishStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
}
