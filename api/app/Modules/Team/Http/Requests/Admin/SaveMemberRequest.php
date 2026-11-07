<?php

namespace App\Modules\Team\Http\Requests\Admin;

use App\Support\TranslatedRules;
use Illuminate\Foundation\Http\FormRequest;

class SaveMemberRequest extends FormRequest
{
    public function rules(): array
    {
        return TranslatedRules::withEnglish([
            'name.ar' => ['required', 'string', 'max:80'],
            'role.ar' => ['required', 'string', 'max:80'],
            'bio.ar' => ['nullable', 'string', 'max:600'],
            'tech' => ['nullable', 'string', 'max:120'],
            'is_founder' => ['sometimes', 'boolean'],
            'is_visible' => ['sometimes', 'boolean'],
        ]);
    }

    public function attributes(): array
    {
        return TranslatedRules::labels([
            'name.ar' => 'الاسم',
            'role.ar' => 'الدور',
            'bio.ar' => 'النبذة',
            'tech' => 'التقنيات',
            'is_founder' => 'مؤسس',
            'is_visible' => 'ظاهر في الموقع',
        ]);
    }

    public function messages(): array
    {
        return TranslatedRules::messages();
    }
}
