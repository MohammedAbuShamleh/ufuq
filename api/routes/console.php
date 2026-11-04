<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Shared hosting keeps no worker alive, so cron runs schedule:run every minute and
// this drains the queue (site refreshes, lead emails), then exits. --max-time keeps
// one run inside its minute; withoutOverlapping guards a slow mail server.
Schedule::command('queue:work', ['--stop-when-empty', '--max-time=50'])
    ->everyMinute()
    ->withoutOverlapping(10);
