<?php

namespace App\Modules\Site\Http\Requests\Admin;

use App\Support\TranslatedRules;
use Illuminate\Foundation\Http\FormRequest;

class SaveFaqRequest extends FormRequest
{
    public function rules(): array
    {
        return TranslatedRules::withEnglish([
            'question.ar' => ['required', 'string', 'max:200'],
            'answer.ar' => ['required', 'string', 'max:1200'],
            'is_visible' => ['sometimes', 'boolean'],
        ]);
    }

    public function attributes(): array
    {
        return TranslatedRules::labels([
            'question.ar' => 'السؤال',
            'answer.ar' => 'الجواب',
            'is_visible' => 'ظاهر في الموقع',
        ]);
    }

    public function messages(): array
    {
        return TranslatedRules::messages();
    }
}
