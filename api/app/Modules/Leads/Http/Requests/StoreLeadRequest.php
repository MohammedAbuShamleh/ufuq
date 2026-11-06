<?php

namespace App\Modules\Leads\Http\Requests;

use App\Support\Translations;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    /** Visitors type their number on an Arabic keyboard as often as not. */
    private const EASTERN_DIGITS = [
        '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
        '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
        '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4',
        '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
    ];

    /** The answers in English, for a visitor on the English site. Keys match messages(). */
    private const ENGLISH = [
        '*.string' => 'That value is not valid.',
        'name.required' => 'Please write your name.',
        'name.max' => 'Your name is longer than 120 characters.',
        'contact.required' => 'Write your email or phone number so we can reply.',
        'contact.max' => 'Write a valid email or phone number.',
        'project_type.max' => 'The project type is longer than allowed.',
        'message.max' => 'Your message is longer than 2,000 characters.',
        'source_page.max' => 'The page address is longer than allowed.',
    ];

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('contact'))) {
            $this->merge(['contact' => trim(strtr($this->input('contact'), self::EASTERN_DIGITS))]);
        }

        // The form says which site it is on; without that, the request's ?lang= decides.
        $locale = $this->input('locale');
        $this->merge(['locale' => is_string($locale) && in_array($locale, Translations::LOCALES, true) ? $locale : App::getLocale()]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:160', $this->emailOrPhone(...)],
            'project_type' => ['nullable', 'string', 'max:60'],
            'message' => ['nullable', 'string', 'max:2000'],
            'source_page' => ['nullable', 'string', 'max:255'],
            'locale' => ['required', Rule::in(Translations::LOCALES)],
            // Honeypot: hidden from people, so only bots fill it. LeadIntake decides.
            'website' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        if ($this->english()) {
            return self::ENGLISH;
        }

        return [
            '*.string' => 'القيمة المرسلة غير صالحة.',
            'name.required' => 'اكتب اسمك.',
            'name.max' => 'الاسم أطول من ١٢٠ حرفاً.',
            'contact.required' => 'اكتب بريدك أو رقم جوالك لنرد عليك.',
            'contact.max' => 'اكتب بريداً صحيحاً أو رقم جوال.',
            'project_type.max' => 'نوع المشروع أطول من المسموح.',
            'message.max' => 'الرسالة أطول من ٢٠٠٠ حرف.',
            'source_page.max' => 'رابط الصفحة أطول من المسموح.',
        ];
    }

    private function emailOrPhone(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        $isEmail = filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
        $digits = strlen(preg_replace('/\D/', '', $value));
        $isPhone = preg_match('/^\+?[\d\s\-().]+$/', $value) === 1 && $digits >= 7 && $digits <= 15;

        if (! $isEmail && ! $isPhone) {
            $fail($this->english() ? self::ENGLISH['contact.max'] : 'اكتب بريداً صحيحاً أو رقم جوال.');
        }
    }

    private function english(): bool
    {
        return $this->input('locale') === 'en';
    }
}
