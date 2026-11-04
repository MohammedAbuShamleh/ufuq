<?php

namespace App\Modules\Portfolio\Http\Requests\Admin;

use App\Modules\Portfolio\Enums\ScreenKind;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Services\ScreenEditor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
            'tab_key' => ['nullable', 'string', 'regex:/^[a-z0-9-]{1,40}$/'],
            'tab_label.ar' => ['nullable', 'string', 'max:60'],
            'alt.ar' => ['required', 'string', 'max:160'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty() || $this->input('kind') !== ScreenKind::Mobile->value || blank($this->input('tab_key'))) {
                return;
            }

            /** @var Project $project */
            $project = $this->route('project');

            if (! app(ScreenEditor::class)->hasDesktopTab($project, $this->input('tab_key'))) {
                $validator->errors()->add('tab_key', ScreenMessages::NO_DESKTOP_TAB);
            }
        }];
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
            'tab_key.regex' => ScreenMessages::TAB_KEY_FORMAT,
        ];
    }
}
