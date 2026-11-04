<?php

namespace App\Modules\Site\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadProfilePdfRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimetypes:application/pdf', 'max:20480'],
        ];
    }

    public function attributes(): array
    {
        return ['file' => 'ملف البروفايل'];
    }

    public function messages(): array
    {
        return [
            'file.mimetypes' => 'ملف البروفايل يجب أن يكون PDF.',
            'file.max' => 'حجم الملف أكبر من ٢٠ ميغابايت.',
        ];
    }
}
