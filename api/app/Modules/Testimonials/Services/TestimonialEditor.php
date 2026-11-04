<?php

namespace App\Modules\Testimonials\Services;

use App\Modules\Portfolio\Services\ProjectLookup;
use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Content\ContentChanged;
use App\Support\Content\ContentTag;
use App\Support\SortOrder;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

/**
 * Testimonials as the dashboard edits them, drafts included. The linked
 * project's title and slug come from Portfolio's lookup, not from a join,
 * so this module still never queries the projects table.
 */
class TestimonialEditor
{
    private const TEXT = ['quote', 'author_name', 'author_title', 'organization'];

    public function __construct(private readonly ProjectLookup $projects) {}

    /** @return Collection<int, Testimonial> */
    public function list(): Collection
    {
        return $this->withProjects(Testimonial::query()->orderBy('sort_order')->orderBy('id')->get());
    }

    public function load(Testimonial $testimonial): Testimonial
    {
        $this->withProjects(new Collection([$testimonial]));

        return $testimonial;
    }

    /** @param  array<string, mixed>  $data */
    public function create(array $data): Testimonial
    {
        $testimonial = new Testimonial(['sort_order' => SortOrder::next(Testimonial::query())]);

        return $this->save($testimonial, $data);
    }

    /** @param  array<string, mixed>  $data */
    public function update(Testimonial $testimonial, array $data): Testimonial
    {
        return $this->save($testimonial, $data);
    }

    public function delete(Testimonial $testimonial): void
    {
        $testimonial->delete();

        ContentChanged::dispatch($this->tags([$testimonial->project_id]));
    }

    /** @param  list<int>  $ids */
    public function reorder(array $ids): void
    {
        SortOrder::apply(Testimonial::query(), $ids);

        // A project page quotes its first testimonial, so the order can change it.
        $projectIds = Testimonial::query()->whereKey($ids)->pluck('project_id')->all();

        ContentChanged::dispatch($this->tags($projectIds));
    }

    /** @param  array<string, mixed>  $data */
    private function save(Testimonial $testimonial, array $data): Testimonial
    {
        return DB::transaction(function () use ($testimonial, $data) {
            $previousProjectId = $testimonial->project_id;

            $testimonial->fill(Arr::only($data, ['project_id', 'status']));

            foreach (self::TEXT as $attribute) {
                Translations::fill($testimonial, $attribute, $data[$attribute]);
            }

            $testimonial->save();

            // Both project pages change when the quote moves from one to the other.
            ContentChanged::dispatch($this->tags([$previousProjectId, $testimonial->project_id]));

            return $this->load($testimonial);
        });
    }

    /**
     * @param  list<int|null>  $projectIds
     * @return list<string>
     */
    private function tags(array $projectIds): array
    {
        $ids = array_values(array_unique(array_filter($projectIds)));
        $pages = array_map(ContentTag::project(...), $this->projects->slugs($ids));

        return [ContentTag::HOME, ...$pages];
    }

    /**
     * @param  Collection<int, Testimonial>  $testimonials
     * @return Collection<int, Testimonial>
     */
    private function withProjects(Collection $testimonials): Collection
    {
        $ids = $testimonials->pluck('project_id')->filter()->unique()->values()->all();
        $projects = $this->projects->titles($ids);

        foreach ($testimonials as $testimonial) {
            $testimonial->setRelation('project', $testimonial->project_id ? $projects->get($testimonial->project_id) : null);
        }

        return $testimonials;
    }
}
