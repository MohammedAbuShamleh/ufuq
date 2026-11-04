<?php

namespace App\Modules\Clients\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadLogoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'logo' => ['required', 'file', 'mimetypes:image/png,image/svg+xml,image/webp,image/jpeg', 'max:4096'],
        ];
    }

    public function attributes(): array
    {
        return ['logo' => 'الشعار'];
    }

    public function messages(): array
    {
        return [
            'logo.mimetypes' => 'الشعار يجب أن يكون PNG أو SVG أو WebP أو JPEG.',
            'logo.max' => 'حجم الشعار أكبر من ٤ ميغابايت.',
        ];
    }
}
