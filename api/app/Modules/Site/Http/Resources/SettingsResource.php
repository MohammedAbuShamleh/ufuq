<?php

namespace App\Modules\Site\Http\Resources;

use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/**
 * Every SettingKey appears, null when unset, so the site can rely on the shape.
 * Translatable values come out in the request locale (null when that locale has
 * none: a second language never borrows the Arabic text); files come out as a URL.
 *
 * @property Collection<string, Setting> $resource
 */
class SettingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $values = [];

        foreach (SettingKey::cases() as $key) {
            $values[$key->value] = $this->present($key, $this->resource->get($key->value));
        }

        return $values;
    }

    private function present(SettingKey $key, ?Setting $setting): mixed
    {
        if ($setting === null) {
            return null;
        }

        if ($key->isFile()) {
            return $setting->getFirstMedia('file')?->getFullUrl();
        }

        if ($key->isTranslatable()) {
            return $setting->value[app()->getLocale()] ?? null;
        }

        return $setting->value;
    }
}
