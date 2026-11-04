<?php

namespace App\Support\Content;

/** Cache tags shared with the site, which tags its fetches the same way. */
final class ContentTag
{
    public const HOME = 'home';

    public const PROJECTS = 'projects';

    public const TEAM = 'team';

    public const SETTINGS = 'settings';

    public static function project(string $slug): string
    {
        return "project:{$slug}";
    }
}
