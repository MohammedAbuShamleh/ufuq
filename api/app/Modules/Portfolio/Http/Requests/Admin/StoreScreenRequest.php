<?php

namespace App\Modules\Portfolio\Http\Requests\Admin;

use App\Modules\Portfolio\Enums\ScreenKind;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreScreenRequest extends FormRequest
{
    public function rules(): array
    {
        // The kind decides what the file must be: a video, or an image for desktop and mobile.
        $file = $this->input('kind') === ScreenKind::Video->value
            ? ['mimetypes:video/mp4,video/webm', 'max:61440']
            : ['mimetypes:image/jpeg,image/png,image/webp', 'max:10240'];

        return [
            'kind' => ['required', Rule::enum(ScreenKind::class)],
            'file' => ['required', 'file', ...$file],
            'label.ar' => ['nullable', 'string', 'max:60'],
            'alt.ar' => ['required', 'string', 'max:160'],
        ];
    }

    public function attributes(): array
    {
        return ScreenMessages::ATTRIBUTES;
    }

    public function messages(): array
    {
        return [
            'file.mimetypes' => $this->input('kind') === ScreenKind::Video->value
                ? 'شاشة الفيديو تحتاج ملف MP4 أو WebM.'
                : 'الصورة يجب أن تكون JPEG أو PNG أو WebP.',
            'file.max' => $this->input('kind') === ScreenKind::Video->value
                ? 'حجم الفيديو أكبر من ٦٠ ميغابايت.'
                : 'حجم الصورة أكبر من ١٠ ميغابايت.',
        ];
    }
}
