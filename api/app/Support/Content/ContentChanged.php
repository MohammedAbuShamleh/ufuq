<?php

namespace App\Support\Content;

use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Something the public site shows was written from the dashboard. Fired after
 * the transaction commits, so a listener never acts on a rolled-back write.
 * The tags name what changed (see ContentTag) so a listener can refresh only
 * those pages; plain strings keep the event safe to queue.
 */
final class ContentChanged implements ShouldDispatchAfterCommit
{
    use Dispatchable;

    /** @param  list<string>  $tags */
    public function __construct(public readonly array $tags) {}
}
