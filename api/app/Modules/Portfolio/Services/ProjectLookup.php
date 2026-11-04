<?php

namespace App\Modules\Portfolio\Services;

use App\Modules\Portfolio\Models\Project;
use Illuminate\Database\Eloquent\Collection;

/** What other modules may ask about projects by id, without querying the table themselves. */
class ProjectLookup
{
    /**
     * Id and title of each live project, keyed by id. Deleted ones are left out.
     *
     * @param  list<int>  $ids
     * @return Collection<int, Project>
     */
    public function titles(array $ids): Collection
    {
        if ($ids === []) {
            return new Collection;
        }

        return Project::query()->whereKey($ids)->get(['id', 'title'])->keyBy('id');
    }

    /**
     * Slugs for cache tags, deleted projects included: their pages must drop too.
     *
     * @param  list<int>  $ids
     * @return list<string>
     */
    public function slugs(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return Project::withTrashed()->whereKey($ids)->pluck('slug')->all();
    }
}
