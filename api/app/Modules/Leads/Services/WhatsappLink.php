<?php

namespace App\Modules\Leads\Services;

/** A wa.me link for a lead who left a phone number, so the team can answer in one click. */
final class WhatsappLink
{
    /** Same shape the contact form accepts as a phone (StoreLeadRequest). */
    private const PHONE = '/^\+?[\d\s\-().]+$/';

    public static function forContact(string $contact): ?string
    {
        $contact = trim($contact);

        if (str_contains($contact, '@') || preg_match(self::PHONE, $contact) !== 1) {
            return null;
        }

        $digits = preg_replace('/\D/', '', $contact);

        if (strlen($digits) < 7 || strlen($digits) > 15) {
            return null;
        }

        $number = match (true) {
            // "+970…" and "00970…" already carry the country code.
            str_starts_with($contact, '+') => $digits,
            str_starts_with($digits, '00') => substr($digits, 2),
            // Assumption: a local number with one leading 0 ("0599…") is Palestinian,
            // since nearly every visitor is; 970 replaces the trunk 0.
            str_starts_with($digits, '0') => '970'.substr($digits, 1),
            // No prefix at all: taken as already international.
            default => $digits,
        };

        return "https://wa.me/{$number}";
    }
}
