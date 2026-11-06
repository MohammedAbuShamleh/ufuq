<?php

namespace Database\Seeders;

use App\Modules\Clients\Models\Client;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use App\Modules\Team\Models\TeamMember;
use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Content\ContentChanged;
use App\Support\Content\ContentTag;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

/**
 * English drafts of the seeded content, for the team to review and edit in the
 * dashboard (php artisan db:seed --class=EnglishDraftSeeder). It writes English
 * only where there is none, so it is safe to run again and never replaces what
 * someone wrote.
 *
 * Drafts are keyed by the exact Arabic (data/english-drafts.php). Arabic edited
 * since has no draft: that item stays off /en until someone writes its English,
 * and the run lists the text. An item gets English only when every field the
 * site needs gets it (REQUIRED_TEXT), as the dashboard requires.
 */
class EnglishDraftSeeder extends Seeder
{
    private const LOCALE = 'en';

    /** @var array<string, string> */
    private array $drafts = [];

    /** @var array<string, true> Arabic that has no draft */
    private array $missing = [];

    /** @var list<string> */
    private array $tags = [];

    private int $written = 0;

    public function run(): void
    {
        $this->drafts = require __DIR__.'/data/english-drafts.php';

        $this->projects();
        $this->each(Client::withTrashed()->get(), Client::REQUIRED_TEXT, [ContentTag::HOME]);
        $this->each(TeamMember::withTrashed()->get(), TeamMember::REQUIRED_TEXT, [ContentTag::HOME, ContentTag::TEAM]);
        $this->each(Testimonial::withTrashed()->get(), Testimonial::REQUIRED_TEXT, [ContentTag::HOME]);
        $this->each(Faq::withTrashed()->get(), Faq::REQUIRED_TEXT, [ContentTag::HOME]);
        $this->settings();

        $this->report();

        if ($this->tags !== []) {
            ContentChanged::dispatch(array_values(array_unique($this->tags)));
        }
    }

    private function projects(): void
    {
        $projects = Project::withTrashed()->with(['facts', 'highlights', 'screens'])->get();

        foreach ($projects as $project) {
            $changed = $this->translate($project, Project::REQUIRED_TEXT);
            $changed = $this->featuredFacts($project) || $changed;

            foreach ([...$project->facts, ...$project->highlights, ...$project->screens] as $child) {
                $changed = $this->translate($child) || $changed;
            }

            if ($changed) {
                array_push($this->tags, ContentTag::HOME, ContentTag::PROJECTS, ContentTag::project($project->slug));
            }
        }
    }

    /**
     * @param  iterable<Model>  $items
     * @param  list<string>  $required
     * @param  list<string>  $tags
     */
    private function each(iterable $items, array $required, array $tags): void
    {
        foreach ($items as $item) {
            if ($this->translate($item, $required)) {
                array_push($this->tags, ...$tags);
            }
        }
    }

    /**
     * Fills the model's missing English and saves it. Nothing is written unless
     * every required field ends up with English.
     *
     * @param  list<string>  $required
     */
    private function translate(Model $model, array $required = []): bool
    {
        $english = [];

        foreach ($model->getTranslatableAttributes() as $field) {
            $arabic = $model->getTranslation($field, Translations::PRIMARY, false);

            if (blank($arabic) || filled($model->getTranslation($field, self::LOCALE, false))) {
                continue;
            }

            if (($draft = $this->draft($arabic)) !== null) {
                $english[$field] = $draft;
            }
        }

        foreach ($required as $field) {
            if (! isset($english[$field]) && blank($model->getTranslation($field, self::LOCALE, false))) {
                return false;
            }
        }

        if ($english === []) {
            return false;
        }

        foreach ($english as $field => $text) {
            $model->setTranslation($field, self::LOCALE, $text);
        }

        $model->save();
        $this->written++;

        return true;
    }

    /** The two facts on a featured card live in a JSON column, not in translatable rows. */
    private function featuredFacts(Project $project): bool
    {
        $facts = $project->featured_facts;
        $changed = false;

        foreach ($facts ?? [] as $i => $fact) {
            $arabic = $fact['label'][Translations::PRIMARY] ?? null;

            if (blank($arabic) || filled($fact['label'][self::LOCALE] ?? null)) {
                continue;
            }

            if (($draft = $this->draft($arabic)) !== null) {
                $facts[$i]['label'][self::LOCALE] = $draft;
                $changed = true;
            }
        }

        if ($changed) {
            $project->featured_facts = $facts;
            $project->save();
            $this->written++;
        }

        return $changed;
    }

    /** Translatable settings: a line of text, or the privacy policy's sections, drafted whole or not at all. */
    private function settings(): void
    {
        foreach (Setting::all() as $setting) {
            $value = $setting->value;
            $arabic = $value[Translations::PRIMARY] ?? null;

            if (! $setting->key->isTranslatable() || blank($arabic) || filled($value[self::LOCALE] ?? null)) {
                continue;
            }

            $english = $this->draftAll($arabic);

            if ($english === null) {
                continue;
            }

            $setting->value = [...$value, self::LOCALE => $english];
            $setting->save();
            $this->written++;
            array_push($this->tags, ContentTag::HOME, ContentTag::SETTINGS);
        }
    }

    /** Every string in the value drafted, keys and shape kept; null when any string has no draft. */
    private function draftAll(mixed $arabic): mixed
    {
        if (is_string($arabic)) {
            return $this->draft($arabic);
        }

        if (! is_array($arabic)) {
            return $arabic;
        }

        $english = array_map($this->draftAll(...), $arabic);

        foreach ($arabic as $key => $text) {
            if ($text !== null && $english[$key] === null) {
                return null;
            }
        }

        return $english;
    }

    private function draft(string $arabic): ?string
    {
        $draft = $this->drafts[trim($arabic)] ?? null;

        if ($draft === null) {
            $this->missing[$arabic] = true;
        }

        return $draft;
    }

    private function report(): void
    {
        $this->command?->info("English drafts written to {$this->written} items.");

        if ($this->missing !== []) {
            $this->command?->warn('No draft for this Arabic, so its items stay off /en until their English is written in the dashboard:');

            foreach (array_keys($this->missing) as $arabic) {
                $this->command?->line("  - {$arabic}");
            }
        }
    }
}
