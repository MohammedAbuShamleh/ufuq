<?php

namespace App\Support\Content;

use App\Support\PublicCache;

/**
 * Drops every cached public response. The cache is versioned as a whole, so
 * the tags are not needed here; they matter to the site's own revalidation.
 */
class FlushPublicCache
{
    public function __construct(private readonly PublicCache $cache) {}

    public function handle(ContentChanged $event): void
    {
        $this->cache->flush();
    }
}
