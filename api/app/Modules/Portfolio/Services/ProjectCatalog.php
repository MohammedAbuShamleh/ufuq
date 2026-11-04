<?php

namespace App\Modules\Portfolio\Services;

use App\Modules\Portfolio\Enums\ProjectSector;
use App\Modules\Portfolio\Enums\ProjectType;
use App\Modules\Portfolio\Models\Project;
use Illuminate\Database\Eloquent\Collection;

/** Read side of the portfolio: what the public site is allowed to see. */
class ProjectCatalog
{
    /** Everything a featured card or a project page shows. */
    private const FULL = ['facts', 'highlights', 'screens.media'];

    /** A list card shows one shot only. */
    private const CARD = ['cover.media'];

    /** @return Collection<int, Project> */
    public function featured(): Collection
    {
        return Project::published()
            ->where('is_featured', true)
            ->with(self::FULL)
            ->orderBy('featured_order')
            ->get();
    }

    /** @return Collection<int, Project> */
    public function others(): Collection
    {
        return Project::published()
            ->where('is_featured', false)
            ->with(self::CARD)
            ->orderBy('sort_order')
            ->get();
    }

    /** @return Collection<int, Project> */
    public function list(?ProjectType $type = null, ?ProjectSector $sector = null): Collection
    {
        return Project::published()
            ->when($type, fn ($query) => $query->where('type', $type))
            ->when($sector, fn ($query) => $query->where('sector', $sector))
            ->with(self::CARD)
            ->orderByDesc('is_featured')
            ->orderBy('featured_order')
            ->orderBy('sort_order')
            ->get();
    }

    /** Drafts and deleted projects do not exist as far as the public site knows. */
    public function findPublishedBySlug(string $slug): Project
    {
        return Project::published()
            ->where('slug', $slug)
            ->with(self::FULL)
            ->firstOrFail();
    }
}
