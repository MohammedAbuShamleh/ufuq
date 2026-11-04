<?php

namespace App\Modules\Site\Http\Resources\Admin;

use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Setting;
use App\Support\Media\MediaResource;
use App\Support\Translations;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

/**
 * The settings form, every field present whether or not its row exists.
 * Unlike the public SettingsResource, translatable values keep all locales.
 *
 * @property Collection<string, Setting> $resource keyed by SettingKey value, media loaded
 */
class SettingsFormResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $social = $this->value(SettingKey::SocialLinks);

        return [
            'whatsapp_number' => $this->value(SettingKey::WhatsappNumber),
            'booking_url' => $this->value(SettingKey::BookingUrl),
            'contact_email' => $this->value(SettingKey::ContactEmail),
            'social_links' => [
                'linkedin' => null,
                'x' => null,
                'instagram' => null,
                ...Arr::only(is_array($social) ? $social : [], ['linkedin', 'x', 'instagram']),
            ],
            'profile_pdf' => MediaResource::make($this->setting(SettingKey::ProfilePdf)?->getFirstMedia('file')),
            'hero_tagline' => $this->translations(SettingKey::HeroTagline),
            'why_we_started' => $this->translations(SettingKey::WhyWeStarted),
            'legal_registration' => $this->translations(SettingKey::LegalRegistration),
            'memberships' => $this->translations(SettingKey::Memberships),
            'privacy_policy' => $this->translations(SettingKey::PrivacyPolicy),
            'privacy_is_draft' => (bool) $this->value(SettingKey::PrivacyIsDraft),
        ];
    }

    private function setting(SettingKey $key): ?Setting
    {
        return $this->resource->get($key->value);
    }

    private function value(SettingKey $key): mixed
    {
        return $this->setting($key)?->value;
    }

    /** @return array<string, mixed> */
    private function translations(SettingKey $key): array
    {
        $value = $this->value($key);

        return Translations::normalize(is_array($value) ? $value : null);
    }
}
