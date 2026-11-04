<?php

namespace App\Support;

use Closure;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\App;

/**
 * Five-minute cache for the public read endpoints. It stores the resolved JSON,
 * not models, so a hit costs no queries. Every key carries a version number,
 * so one flush() invalidates them all when content changes.
 *
 * Caching stays on the server on purpose: no public Cache-Control headers, so
 * a proxy in front of the API can never serve content the dashboard replaced.
 */
class PublicCache
{
    private const VERSION_KEY = 'public-api:version';

    private const TTL_SECONDS = 300;

    public function __construct(private readonly Repository $cache) {}

    /** @param  Closure(): JsonResource  $build */
    public function respond(string $key, Closure $build): JsonResponse
    {
        $version = $this->cache->get(self::VERSION_KEY, 1);
        $locale = App::getLocale();

        $payload = $this->cache->remember(
            "public-api:v{$version}:{$locale}:{$key}",
            self::TTL_SECONDS,
            fn () => $build()->response()->getData(true),
        );

        return new JsonResponse($payload, options: JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public function flush(): void
    {
        $this->cache->add(self::VERSION_KEY, 1);
        $this->cache->increment(self::VERSION_KEY);
    }
}
