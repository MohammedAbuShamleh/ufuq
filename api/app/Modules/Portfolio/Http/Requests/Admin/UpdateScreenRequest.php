<?php

namespace App\Modules\Portfolio\Http\Requests\Admin;

use App\Modules\Portfolio\Enums\ScreenKind;
use App\Modules\Portfolio\Models\ProjectScreen;
use App\Modules\Portfolio\Services\ScreenEditor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/** PATCH: only the keys sent change; the checks run on the screen as it would end up. */
class UpdateScreenRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'kind' => ['sometimes', 'required', Rule::enum(ScreenKind::class)],
            'label.ar' => ['sometimes', 'nullable', 'string', 'max:60'],
            'alt.ar' => ['sometimes', 'required', 'string', 'max:160'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty() || ! $this->has('kind')) {
                return;
            }

            /** @var ProjectScreen $screen */
            $screen = $this->route('screen');

            if (! app(ScreenEditor::class)->fileMatchesKind($screen, ScreenKind::from($this->input('kind')))) {
                $validator->errors()->add('kind', 'نوع الشاشة لا يطابق ملفها: الفيديو لشاشة الفيديو، والصورة لشاشتي الحاسوب والجوال.');
            }
        }];
    }

    public function attributes(): array
    {
        return ScreenMessages::ATTRIBUTES;
    }
}
