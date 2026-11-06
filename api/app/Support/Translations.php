<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

/**
 * Translatable values as the dashboard reads and writes them: an object that
 * always carries the primary locale. Spatie returns [] for a null column, and a
 * form bound to `title.ar` needs the key to exist even while the text is empty.
 *
 * Also the rule for what the public site shows in a second language: an item
 * appears there only once every field Arabic requires has text in that language.
 */
final class Translations
{
    public const PRIMARY = 'ar';

    /** Every locale the site is published in, the primary first. */
    public const LOCALES = ['ar', 'en'];

    /**
     * True when each field has text in the locale (the request's by default).
     * The primary locale always counts: Arabic shows what it has, pending or not.
     *
     * @param  list<string>  $fields
     */
    public static function complete(Model $model, array $fields, ?string $locale = null): bool
    {
        $locale ??= App::getLocale();

        if ($locale === self::PRIMARY) {
            return true;
        }

        foreach ($fields as $field) {
            if (! filled($model->getTranslation($field, $locale, false))) {
                return false;
            }
        }

        return true;
    }

    /**
     * The items that can appear in the request's locale, in their order.
     *
     * @template TModel of Model
     *
     * @param  Collection<int, TModel>  $items
     * @param  list<string>  $fields
     * @return Collection<int, TModel>
     */
    public static function shown(Collection $items, array $fields): Collection
    {
        return $items->filter(fn (Model $item) => self::complete($item, $fields))->values();
    }

    /**
     * The locales an item can appear in, so the site knows where its language switch can go.
     *
     * @param  list<string>  $fields
     * @return list<string>
     */
    public static function locales(Model $model, array $fields): array
    {
        return array_values(array_filter(self::LOCALES, fn (string $locale) => self::complete($model, $fields, $locale)));
    }

    /** @return array<string, mixed> */
    public static function of(Model $model, string $attribute): array
    {
        return self::normalize($model->getTranslations($attribute));
    }

    /**
     * @param  array<string, mixed>|null  $stored
     * @return array<string, mixed>
     */
    public static function normalize(?array $stored): array
    {
        return [self::PRIMARY => null, ...($stored ?? [])];
    }

    /**
     * Writes only the locales given, so a locale the form does not edit yet
     * (a future `en`) survives the save.
     *
     * @param  array<string, mixed>|null  $values
     */
    public static function fill(Model $model, string $attribute, ?array $values): void
    {
        foreach ($values ?: [self::PRIMARY => null] as $locale => $value) {
            $model->setTranslation($attribute, $locale, $value);
        }
    }

    /**
     * The same merge for values kept in a plain JSON column (settings).
     *
     * @param  array<string, mixed>|null  $stored
     * @param  array<string, mixed>|null  $values
     * @return array<string, mixed>|null null when no locale has text, as the seeder stores pending values
     */
    public static function merge(?array $stored, ?array $values): ?array
    {
        $merged = [...($stored ?? []), ...($values ?: [self::PRIMARY => null])];

        return array_filter($merged, fn ($value) => $value !== null) === [] ? null : $merged;
    }
}
