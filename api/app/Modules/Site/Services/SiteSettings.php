<?php

namespace App\Modules\Site\Services;

use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use Illuminate\Database\Eloquent\Collection;

class SiteSettings
{
    /** @return Collection<string, Setting> keyed by SettingKey value */
    public function all(): Collection
    {
        return Setting::with('media')->get()->keyBy(fn (Setting $setting) => $setting->key->value);
    }

    /** @return Collection<int, Faq> */
    public function faqs(): Collection
    {
        return Faq::visible()->orderBy('sort_order')->get();
    }
}
