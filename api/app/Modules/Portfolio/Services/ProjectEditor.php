<?php

namespace App\Modules\Portfolio\Services;

use App\Modules\Portfolio\Models\Project;
use App\Support\Content\ContentChanged;
use App\Support\Content\ContentTag;
use App\Support\Enums\PublishStatus;
use App\Support\SortOrder;
use App\Support\Translations;
use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

/** Write side of the portfolio: what the dashboard edits, drafts included. */
class ProjectEditor
{
    private const SCALARS = [
        'slug', 'type', 'sector', 'country', 'is_featured', 'featured_order', 'card_theme', 'has_demo_data', 'status',
    ];

    private const REQUIRED_TEXT = ['title', 'client_name', 'summary', 'tag'];

    /** Absent from a full save means cleared: the text is pending again. */
    private const OPTIONAL_TEXT = ['frame_label', 'challenge', 'solution', 'results'];

    /** Everything the project form shows. */
    private const FULL = ['facts', 'highlights', 'screens.media'];

    /** @return Collection<int, Project> */
    public function list(): Collection
    {
        return Project::query()
            ->with('cover.media')
            ->withCount('screens')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function load(Project $project): Project
    {
        return $project->load(self::FULL);
    }

    /** @param  array<string, mixed>  $data  validated SaveProjectRequest input */
    public function create(array $data): Project
    {
        return DB::transaction(function () use ($data) {
            $project = new Project([
                'tech_stack' => [],
                'is_featured' => false,
                'featured_order' => 0,
                'has_demo_data' => false,
                'sort_order' => SortOrder::next(Project::query()),
            ]);

            $this->write($project, $data);

            ContentChanged::dispatch($this->tags($project->slug));

            return $this->load($project);
        });
    }

    /** @param  array<string, mixed>  $data  validated SaveProjectRequest input */
    public function update(Project $project, array $data): Project
    {
        return DB::transaction(function () use ($project, $data) {
            $oldSlug = $project->slug;

            $this->write($project, $data);

            // Both pages change when the link does: the old one must stop resolving.
            ContentChanged::dispatch($this->tags($project->slug, $oldSlug));

            return $this->load($project);
        });
    }

    public function delete(Project $project): void
    {
        $project->delete();

        ContentChanged::dispatch($this->tags($project->slug));
    }

    /** @param  list<int>  $ids */
    public function reorder(array $ids): void
    {
        SortOrder::apply(Project::query(), $ids);

        ContentChanged::dispatch([ContentTag::HOME, ContentTag::PROJECTS]);
    }

    /** @return list<string> */
    public function tags(string ...$slugs): array
    {
        $pages = array_map(ContentTag::project(...), array_unique($slugs));

        return [ContentTag::HOME, ContentTag::PROJECTS, ...$pages];
    }

    /** @param  array<string, mixed>  $data */
    private function write(Project $project, array $data): void
    {
        $project->fill(Arr::only($data, self::SCALARS));

        if (array_key_exists('tech_stack', $data)) {
            $project->tech_stack = array_values($data['tech_stack'] ?? []);
        }

        foreach (self::REQUIRED_TEXT as $attribute) {
            Translations::fill($project, $attribute, $data[$attribute]);
        }

        foreach (self::OPTIONAL_TEXT as $attribute) {
            Translations::fill($project, $attribute, $data[$attribute] ?? null);
        }

        // Set on first publication only: unpublishing and publishing again keeps the date.
        if ($project->status === PublishStatus::Published && $project->published_at === null) {
            $project->published_at = now();
        }

        $project->save();

        if (array_key_exists('facts', $data)) {
            $this->replaceSet($project->facts(), $data['facts'] ?? [], function (Model $fact, array $row) {
                $fact->value = $row['value'];
                Translations::fill($fact, 'label', $row['label'] ?? null);
            });
        }

        if (array_key_exists('highlights', $data)) {
            $this->replaceSet($project->highlights(), $data['highlights'] ?? [], function (Model $highlight, array $row) {
                Translations::fill($highlight, 'text', $row['text'] ?? null);
            });
        }
    }

    /**
     * The form sends the whole list: rows with a known id are updated, rows
     * without one are created, and rows no longer sent are soft-deleted. An id
     * from another project is treated as new rather than moved across.
     *
     * @param  list<array<string, mixed>>  $rows
     * @param  Closure(Model, array<string, mixed>): void  $fill
     */
    private function replaceSet(HasMany $relation, array $rows, Closure $fill): void
    {
        $existing = $relation->get()->keyBy('id');
        $kept = [];

        // validated() builds the list rule by rule, so a row with an optional id can
        // come before an earlier row without one. The index is the form's order.
        ksort($rows);

        foreach (array_values($rows) as $index => $row) {
            $child = (isset($row['id']) ? $existing->get($row['id']) : null) ?? $relation->make();

            $fill($child, $row);
            $child->sort_order = $index;
            $child->save();

            $kept[] = $child->getKey();
        }

        $relation->getRelated()->newQuery()
            ->where($relation->getForeignKeyName(), $relation->getParentKey())
            ->whereKeyNot($kept)
            ->delete();
    }
}
