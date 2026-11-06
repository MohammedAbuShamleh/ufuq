<?php

namespace App\Modules\Site\Services;

use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Collection;

class SiteSettings
{
    /** @return Collection<string, Setting> keyed by SettingKey value */
    public function all(): Collection
    {
        return Setting::with('media')->get()->keyBy(fn (Setting $setting) => $setting->key->value);
    }

    /** «بريد التواصل»: also where contact-form messages are emailed. Null until it is set. */
    public function contactEmail(): ?string
    {
        $email = Setting::query()->where('key', SettingKey::ContactEmail->value)->value('value');

        return is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }

    /** @return Collection<int, Faq> */
    public function faqs(): Collection
    {
        return Translations::shown(Faq::visible()->orderBy('sort_order')->get(), Faq::REQUIRED_TEXT);
    }
}
