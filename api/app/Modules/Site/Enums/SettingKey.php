<?php

namespace App\Modules\Site\Enums;

/**
 * Every site-wide setting. Keys beyond the handoff list exist because each
 * pending content item must be a field in the dashboard (why we started,
 * registration, memberships) and /privacy reads its text from settings.
 */
enum SettingKey: string
{
    case WhatsappNumber = 'whatsapp_number';
    case BookingUrl = 'booking_url';
    case ContactEmail = 'contact_email';
    case SocialLinks = 'social_links';
    case ProfilePdf = 'profile_pdf';
    case HeroTagline = 'hero_tagline';
    case WhyWeStarted = 'why_we_started';
    case LegalRegistration = 'legal_registration';
    case Memberships = 'memberships';
    case PrivacyPolicy = 'privacy_policy';
    case PrivacyIsDraft = 'privacy_is_draft';

    /** Stored as {"ar": …, "en": …} and resolved to the current locale. */
    public function isTranslatable(): bool
    {
        return in_array($this, [
            self::HeroTagline,
            self::WhyWeStarted,
            self::LegalRegistration,
            self::Memberships,
            self::PrivacyPolicy,
        ], true);
    }

    /** Value lives in the media library, not in the value column. */
    public function isFile(): bool
    {
        return $this === self::ProfilePdf;
    }
}
