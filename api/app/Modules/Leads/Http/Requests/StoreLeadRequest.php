<?php

namespace App\Modules\Leads\Http\Requests;

use Closure;
use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
{
    /** Visitors type their number on an Arabic keyboard as often as not. */
    private const EASTERN_DIGITS = [
        '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
        '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
        '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4',
        '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
    ];

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('contact'))) {
            $this->merge(['contact' => trim(strtr($this->input('contact'), self::EASTERN_DIGITS))]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'contact' => ['required', 'string', 'max:160', $this->emailOrPhone(...)],
            'project_type' => ['nullable', 'string', 'max:60'],
            'message' => ['nullable', 'string', 'max:2000'],
            'source_page' => ['nullable', 'string', 'max:255'],
            // Honeypot: hidden from people, so only bots fill it. LeadIntake decides.
            'website' => ['nullable'],
        ];
    }

    public function messages(): array
    {
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
            $fail('اكتب بريداً صحيحاً أو رقم جوال.');
        }
    }
}
