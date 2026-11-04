<?php

namespace App\Modules\Portfolio\Http\Requests\Admin;

use App\Modules\Portfolio\Enums\CardTheme;
use App\Modules\Portfolio\Enums\ProjectSector;
use App\Modules\Portfolio\Enums\ProjectType;
use App\Modules\Portfolio\Models\Project;
use App\Support\Enums\PublishStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Create and update: the form always sends the whole project. */
class SaveProjectRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('country'))) {
            $this->merge(['country' => strtoupper(trim($this->input('country')))]);
        }
    }

    public function rules(): array
    {
        /** @var Project|null $project */
        $project = $this->route('project');

        return [
            // Soft-deleted projects keep their slug (the index is unique), so they count.
            'slug' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9]+(-[a-z0-9]+)*$/', Rule::unique('projects', 'slug')->ignore($project?->id)],
            'title.ar' => ['required', 'string', 'max:120'],
            'client_name.ar' => ['required', 'string', 'max:120'],
            'summary.ar' => ['required', 'string', 'max:400'],
            'tag.ar' => ['required', 'string', 'max:120'],
            'frame_label.ar' => ['nullable', 'string', 'max:120'],
            'challenge.ar' => ['nullable', 'string', 'max:2000'],
            'solution.ar' => ['nullable', 'string', 'max:2000'],
            'results.ar' => ['nullable', 'string', 'max:2000'],
            'type' => ['required', Rule::enum(ProjectType::class)],
            'sector' => ['required', Rule::enum(ProjectSector::class)],
            'country' => ['required', 'string', 'regex:/^[A-Z]{2}$/'],
            'tech_stack' => ['sometimes', 'nullable', 'list', 'max:8'],
            'tech_stack.*' => ['required', 'string', 'max:40', 'distinct'],
            'is_featured' => ['sometimes', 'boolean'],
            'featured_order' => ['sometimes', 'integer', 'min:0', 'max:1000'],
            'card_theme' => ['sometimes', 'nullable', Rule::enum(CardTheme::class)],
            'has_demo_data' => ['sometimes', 'boolean'],
            'status' => ['required', Rule::enum(PublishStatus::class)],
            'facts' => ['sometimes', 'nullable', 'list', 'max:3'],
            'facts.*.id' => ['nullable', 'integer'],
            'facts.*.value' => ['required', 'string', 'max:32'],
            'facts.*.label.ar' => ['required', 'string', 'max:60'],
            'highlights' => ['sometimes', 'nullable', 'list', 'max:6'],
            'highlights.*.id' => ['nullable', 'integer'],
            'highlights.*.text.ar' => ['required', 'string', 'max:200'],
        ];
    }

    public function attributes(): array
    {
        return [
            'slug' => 'رابط المشروع',
            'title.ar' => 'اسم المشروع',
            'client_name.ar' => 'اسم العميل',
            'summary.ar' => 'الوصف المختصر',
            'tag.ar' => 'الوسم',
            'frame_label.ar' => 'عنوان شريط المتصفح',
            'challenge.ar' => 'التحدي',
            'solution.ar' => 'الحل',
            'results.ar' => 'النتائج',
            'type' => 'نوع المشروع',
            'sector' => 'القطاع',
            'country' => 'الدولة',
            'tech_stack' => 'التقنيات',
            'tech_stack.*' => 'التقنية',
            'is_featured' => 'مشروع مميز',
            'featured_order' => 'الترتيب بين المميزة',
            'card_theme' => 'لون البطاقة',
            'has_demo_data' => 'بيانات تجريبية',
            'status' => 'الحالة',
            'facts' => 'الأرقام',
            'facts.*.id' => 'رقم السطر',
            'facts.*.value' => 'الرقم',
            'facts.*.label.ar' => 'وصف الرقم',
            'highlights' => 'النقاط',
            'highlights.*.id' => 'رقم السطر',
            'highlights.*.text.ar' => 'نص النقطة',
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'الرابط حروف إنجليزية صغيرة وأرقام، تفصل بينها شرطة (مثل school-system).',
            'slug.unique' => 'هذا الرابط مستخدم لمشروع آخر، وقد يكون مشروعاً محذوفاً. اختر رابطاً غيره.',
            'country.regex' => 'رمز الدولة حرفان إنجليزيان كبيران (مثل PS).',
        ];
    }
}
