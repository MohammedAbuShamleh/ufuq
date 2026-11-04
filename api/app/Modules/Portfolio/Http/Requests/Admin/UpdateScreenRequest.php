<?php

namespace App\Modules\Portfolio\Http\Requests\Admin;

use App\Modules\Portfolio\Enums\ScreenKind;
use App\Modules\Portfolio\Models\Project;
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
            'tab_key' => ['sometimes', 'nullable', 'string', 'regex:/^[a-z0-9-]{1,40}$/'],
            'tab_label.ar' => ['sometimes', 'nullable', 'string', 'max:60'],
            'alt.ar' => ['sometimes', 'required', 'string', 'max:160'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var Project $project */
            $project = $this->route('project');
            /** @var ProjectScreen $screen */
            $screen = $this->route('screen');
            $screens = app(ScreenEditor::class);

            $kind = $this->has('kind') ? ScreenKind::from($this->input('kind')) : $screen->kind;
            $tabKey = $this->exists('tab_key') ? $this->input('tab_key') : $screen->tab_key;

            if (! $screens->fileMatchesKind($screen, $kind)) {
                $validator->errors()->add('kind', 'نوع الشاشة لا يطابق ملفها: الفيديو لشاشة الفيديو، والصورة لشاشتي الحاسوب والجوال.');
            }

            if ($kind === ScreenKind::Mobile && filled($tabKey) && ! $screens->hasDesktopTab($project, $tabKey, except: $screen)) {
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
        return ['tab_key.regex' => ScreenMessages::TAB_KEY_FORMAT];
    }
}
