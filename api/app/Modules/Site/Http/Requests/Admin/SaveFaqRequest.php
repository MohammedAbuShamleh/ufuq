<?php

namespace App\Modules\Site\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SaveFaqRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'question.ar' => ['required', 'string', 'max:200'],
            'answer.ar' => ['required', 'string', 'max:1200'],
            'is_visible' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'question.ar' => 'السؤال',
            'answer.ar' => 'الجواب',
            'is_visible' => 'ظاهر في الموقع',
        ];
    }
}
