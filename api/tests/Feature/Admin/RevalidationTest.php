<?php

namespace Tests\Feature\Admin;

use App\Support\Content\ContentChanged;
use App\Support\Content\RevalidateFrontend;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Events\CallQueuedListener;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class RevalidationTest extends TestCase
{
    use RefreshDatabase;

    private const URL = 'https://ufuq.test/api/revalidate';

    public function test_a_content_change_queues_the_site_refresh(): void
    {
        // Which tags each save announces is covered per section (ProjectsTest and others).
        Queue::fake();

        ContentChanged::dispatch(['home', 'projects']);

        Queue::assertPushed(CallQueuedListener::class, fn (CallQueuedListener $job) => $job->class === RevalidateFrontend::class
            && $job->data[0]->tags === ['home', 'projects']);
    }

    public function test_the_site_gets_the_tags_once_each_with_the_secret(): void
    {
        config(['services.site.revalidate_url' => self::URL, 'services.site.revalidate_secret' => 'shared-secret']);
        Http::fake([self::URL => Http::response(['revalidated' => ['home', 'projects']])]);

        app(RevalidateFrontend::class)->handle(new ContentChanged(['home', 'projects', 'home']));

        Http::assertSent(fn (Request $request) => $request->url() === self::URL
            && $request->method() === 'POST'
            && $request->hasHeader('Authorization', 'Bearer shared-secret')
            && $request['tags'] === ['home', 'projects']);
    }

    public function test_a_site_that_is_down_fails_the_job_so_the_queue_retries(): void
    {
        config(['services.site.revalidate_url' => self::URL, 'services.site.revalidate_secret' => 'shared-secret']);
        Http::fake([self::URL => Http::response('', 502)]);

        $this->expectException(RequestException::class);

        app(RevalidateFrontend::class)->handle(new ContentChanged(['home']));
    }

    public function test_nothing_is_sent_where_the_site_is_not_wired(): void
    {
        Http::fake();

        app(RevalidateFrontend::class)->handle(new ContentChanged(['home']));

        Http::assertNothingSent();
    }

    public function test_cron_drains_the_queue_every_minute(): void
    {
        $worker = collect(app(Schedule::class)->events())
            ->first(fn ($event) => str_contains((string) $event->command, 'queue:work'));

        $this->assertNotNull($worker, 'routes/console.php schedules no queue worker.');
        $this->assertSame('* * * * *', $worker->expression);
        $this->assertStringContainsString('--stop-when-empty', $worker->command);
    }
}
