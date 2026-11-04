<?php

namespace App\Modules\Site\Services;

use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Setting;
use App\Support\Content\ContentChanged;
use App\Support\Content\ContentTag;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

/** The settings form: partial saves, stored the way SiteSeeder stores them. */
class SettingsEditor
{
    private const TAGS = [ContentTag::HOME, ContentTag::SETTINGS];

    private const SOCIAL_NETWORKS = ['linkedin', 'x', 'instagram'];

    public function __construct(private readonly SiteSettings $site) {}

    /** @return Collection<string, Setting> keyed by SettingKey value */
    public function all(): Collection
    {
        return $this->site->all();
    }

    /**
     * Only the keys present change; a missing row is created.
     *
     * @param  array<string, mixed>  $data  validated UpdateSettingsRequest input
     * @return Collection<string, Setting>
     */
    public function update(array $data): Collection
    {
        DB::transaction(function () use ($data) {
            $stored = Setting::query()->get()->keyBy(fn (Setting $setting) => $setting->key->value);

            foreach (SettingKey::cases() as $key) {
                if ($key->isFile() || ! array_key_exists($key->value, $data)) {
                    continue;
                }

                $setting = $stored->get($key->value) ?? new Setting(['key' => $key]);
                $setting->value = $this->value($key, $setting->value, $data[$key->value]);
                $setting->save();
            }

            ContentChanged::dispatch(self::TAGS);
        });

        return $this->all();
    }

    /** @return Collection<string, Setting> */
    public function setProfilePdf(UploadedFile $file): Collection
    {
        $setting = Setting::query()->firstOrCreate(['key' => SettingKey::ProfilePdf->value], ['value' => null]);

        // Single-file collection: the new PDF replaces the old one.
        $setting->addMedia($file)->toMediaCollection('file');

        ContentChanged::dispatch(self::TAGS);

        return $this->all();
    }

    /** @return Collection<string, Setting> */
    public function removeProfilePdf(): Collection
    {
        Setting::query()->where('key', SettingKey::ProfilePdf->value)->first()?->clearMediaCollection('file');

        ContentChanged::dispatch(self::TAGS);

        return $this->all();
    }

    private function value(SettingKey $key, mixed $stored, mixed $input): mixed
    {
        $stored = is_array($stored) ? $stored : null;

        return match (true) {
            $key === SettingKey::SocialLinks => [
                ...array_fill_keys(self::SOCIAL_NETWORKS, null),
                ...Arr::only($stored ?? [], self::SOCIAL_NETWORKS),
                ...Arr::only((array) $input, self::SOCIAL_NETWORKS),
            ],
            $key === SettingKey::PrivacyPolicy => Translations::merge($stored, $this->privacySections($input)),
            $key->isTranslatable() => Translations::merge($stored, $input),
            $key === SettingKey::PrivacyIsDraft => (bool) $input,
            default => $input,
        };
    }

    /**
     * Rebuilt as {heading, paragraphs} so the page always gets the same shape.
     *
     * @return array<string, mixed>|null
     */
    private function privacySections(mixed $input): ?array
    {
        if (! is_array($input)) {
            return null;
        }

        return array_map(function (?array $sections) {
            if (! $sections) {
                return null;
            }

            // Keyed by the form's index; validated() may not insert them in order.
            ksort($sections);

            return array_map(fn (array $section) => [
                'heading' => $section['heading'],
                'paragraphs' => $this->inOrder($section['paragraphs']),
            ], array_values($sections));
        }, $input);
    }

    /**
     * @param  array<int, string>  $items
     * @return list<string>
     */
    private function inOrder(array $items): array
    {
        ksort($items);

        return array_values($items);
    }
}
