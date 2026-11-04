<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

/**
 * Translatable values as the dashboard reads and writes them: an object that
 * always carries the primary locale. Spatie returns [] for a null column, and a
 * form bound to `title.ar` needs the key to exist even while the text is empty.
 */
final class Translations
{
    public const PRIMARY = 'ar';

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
