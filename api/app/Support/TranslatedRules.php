<?php

namespace App\Support;

/**
 * Validation for translated fields. A form request writes its Arabic rules
 * (`title.ar`, `facts.*.label.ar`, `privacy_policy.ar.*.heading` …) and these
 * helpers add the English twin of each, so the two languages never drift apart.
 *
 * English is optional, but an item's English is whole: once any of its English
 * fields has text, every field Arabic requires needs English too. The site hides
 * an item from /en until then (Translations::complete), so the editor is told on
 * save instead of wondering why it does not appear.
 */
final class TranslatedRules
{
    private const SOURCE = Translations::PRIMARY;

    private const TARGET = 'en';

    /**
     * @param  array<string, mixed>  $rules
     * @return array<string, mixed> the same rules, each translated key followed by its English twin
     */
    public static function withEnglish(array $rules): array
    {
        // The item's own fields (`title.ar`, not `facts.*.label.ar`) form the all-or-nothing group.
        $group = [];
        foreach (array_keys($rules) as $key) {
            if (self::isItemField($key)) {
                $group[] = self::twin($key);
            }
        }

        $out = [];
        foreach ($rules as $key => $rule) {
            $out[$key] = $rule;
            $twin = self::twin($key);

            if ($twin === null || array_key_exists($twin, $rules)) {
                continue;
            }

            $list = is_string($rule) ? explode('|', $rule) : $rule;

            // Inside an English list (`privacy_policy.en.*.heading`) the rules apply as they
            // are: they only run for rows that exist. A text that ends in the locale is optional.
            if (str_ends_with($key, '.'.self::SOURCE)) {
                $required = in_array('required', $list, true);
                $list = array_values(array_filter($list, fn ($r) => $r !== 'required' && $r !== 'nullable'));
                $list = self::afterSometimes($list, 'nullable');

                $others = array_values(array_diff($group, [$twin]));
                if ($required && self::isItemField($key) && $others !== []) {
                    $list[] = 'required_with:'.implode(',', $others);
                }
            }

            $out[$twin] = $list;
        }

        return $out;
    }

    /**
     * @param  array<string, string>  $attributes
     * @return array<string, string> the same labels, with «… بالإنجليزية» for each English twin
     */
    public static function labels(array $attributes): array
    {
        $out = [];
        foreach ($attributes as $key => $label) {
            $out[$key] = $label;
            $twin = self::twin($key);

            if ($twin !== null && ! array_key_exists($twin, $attributes)) {
                $out[$twin] = $label.' بالإنجليزية';
            }
        }

        return $out;
    }

    /** @return array<string, string> */
    public static function messages(): array
    {
        return [
            '*.'.self::TARGET.'.required_with' => 'اكتب :attribute: النص الإنجليزي يظهر في الموقع بعد أن تكتمل حقوله المطلوبة كلها.',
        ];
    }

    /** `title.ar` → `title.en`; `privacy_policy.ar.*.heading` → `privacy_policy.en.*.heading`; null when untranslated. */
    private static function twin(string $key): ?string
    {
        $segments = explode('.', $key);
        $at = array_search(self::SOURCE, $segments, true);

        if ($at === false) {
            return null;
        }

        $segments[$at] = self::TARGET;

        return implode('.', $segments);
    }

    private static function isItemField(string $key): bool
    {
        return ! str_contains($key, '*') && substr_count($key, '.') === 1 && str_ends_with($key, '.'.self::SOURCE);
    }

    /**
     * @param  list<mixed>  $list
     * @return list<mixed>
     */
    private static function afterSometimes(array $list, string $rule): array
    {
        $at = array_search('sometimes', $list, true);

        return $at === false
            ? [$rule, ...$list]
            : [...array_slice($list, 0, $at + 1), $rule, ...array_slice($list, $at + 1)];
    }
}
