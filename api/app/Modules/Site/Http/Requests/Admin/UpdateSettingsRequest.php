<?php

namespace App\Modules\Site\Http\Requests\Admin;

use App\Support\TranslatedRules;
use Illuminate\Foundation\Http\FormRequest;

/** Partial save: every key is optional, and only the keys sent change. */
class UpdateSettingsRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        // People paste numbers as "+970 599-123 456" or "00970…"; WhatsApp links need the digits.
        if (is_string($this->input('whatsapp_number'))) {
            $number = preg_replace('/[\s\-().]/', '', $this->input('whatsapp_number'));
            $this->merge(['whatsapp_number' => preg_replace('/^00/', '+', $number)]);
        }
    }

    public function rules(): array
    {
        $url = ['sometimes', 'nullable', 'string', 'max:255', 'url:http,https'];

        return TranslatedRules::withEnglish([
            // The site links to wa.me/<digits> as stored, so a local "059…" number would
            // open the wrong chat: the country code is required (E.164, 8 to 15 digits).
            'whatsapp_number' => ['sometimes', 'nullable', 'string', 'regex:/^\+?[1-9]\d{7,14}$/'],
            'booking_url' => $url,
            'contact_email' => ['sometimes', 'nullable', 'string', 'email', 'max:160'],
            'social_links' => ['sometimes', 'array'],
            'social_links.linkedin' => $url,
            'social_links.x' => $url,
            'social_links.instagram' => $url,
            'hero_tagline.ar' => ['sometimes', 'nullable', 'string', 'max:200'],
            'why_we_started.ar' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'legal_registration.ar' => ['sometimes', 'nullable', 'string', 'max:600'],
            'memberships.ar' => ['sometimes', 'nullable', 'string', 'max:1200'],
            'privacy_policy.ar' => ['sometimes', 'nullable', 'list', 'max:30'],
            'privacy_policy.ar.*.heading' => ['required', 'string', 'max:160'],
            'privacy_policy.ar.*.paragraphs' => ['required', 'list', 'min:1', 'max:30'],
            'privacy_policy.ar.*.paragraphs.*' => ['required', 'string', 'max:3000'],
            'privacy_is_draft' => ['sometimes', 'boolean'],
        ]);
    }

    public function attributes(): array
    {
        return TranslatedRules::labels([
            'whatsapp_number' => 'رقم واتساب',
            'booking_url' => 'رابط حجز الجلسة',
            'contact_email' => 'بريد التواصل',
            'social_links' => 'روابط التواصل الاجتماعي',
            'social_links.linkedin' => 'رابط لينكدإن',
            'social_links.x' => 'رابط إكس',
            'social_links.instagram' => 'رابط إنستغرام',
            'hero_tagline.ar' => 'السطر التعريفي',
            'why_we_started.ar' => 'لماذا بدأنا',
            'legal_registration.ar' => 'التسجيل القانوني',
            'memberships.ar' => 'العضويات',
            'privacy_policy.ar' => 'سياسة الخصوصية',
            'privacy_policy.ar.*.heading' => 'عنوان القسم',
            'privacy_policy.ar.*.paragraphs' => 'فقرات القسم',
            'privacy_policy.ar.*.paragraphs.*' => 'الفقرة',
            'privacy_is_draft' => 'سياسة الخصوصية مسودة',
        ]);
    }

    public function messages(): array
    {
        return [
            'whatsapp_number.regex' => 'اكتب رقم واتساب بالصيغة الدولية: رمز الدولة ثم الرقم دون الصفر الأول، مثل 970599123456.',
            ...TranslatedRules::messages(),
        ];
    }
}
