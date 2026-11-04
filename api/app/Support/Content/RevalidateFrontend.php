<?php

namespace App\Support\Content;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Asks the site to refresh the pages a save touched (POST /api/revalidate).
 * Queued, so the person saving never waits on the site, and a site that is
 * restarting is retried instead of failing the save. On shared hosting cron
 * drains the queue every minute (routes/console.php), so a change shows on
 * the site within a minute.
 */
class RevalidateFrontend implements ShouldQueue
{
    /** Five tries over about ten minutes outlast a site restart or a deploy. */
    public int $tries = 5;

    /** @return list<int> seconds before each retry */
    public function backoff(): array
    {
        return [30, 60, 120, 300];
    }

    public function handle(ContentChanged $event): void
    {
        $url = config('services.site.revalidate_url');
        $secret = config('services.site.revalidate_secret');

        // Not wired here (tests, or a machine without the site): the API cache flush is enough.
        if (blank($url) || blank($secret)) {
            return;
        }

        Http::withToken($secret)
            ->acceptJson()
            ->timeout(10)
            ->post($url, ['tags' => array_values(array_unique($event->tags))])
            ->throw();
    }

    /** After the last try the site keeps the old page until its hourly refresh. */
    public function failed(ContentChanged $event, Throwable $exception): void
    {
        Log::error('The site was not told to refresh; it catches up within the hour.', [
            'tags' => $event->tags,
            'error' => $exception->getMessage(),
        ]);
    }
}
