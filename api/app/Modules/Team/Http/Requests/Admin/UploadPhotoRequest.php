<?php

namespace App\Modules\Team\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadPhotoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'photo' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/webp', 'max:8192'],
        ];
    }

    public function attributes(): array
    {
        return ['photo' => 'الصورة'];
    }

    public function messages(): array
    {
        return [
            'photo.mimetypes' => 'الصورة يجب أن تكون JPEG أو PNG أو WebP.',
            'photo.max' => 'حجم الصورة أكبر من ٨ ميغابايت.',
        ];
    }
}
