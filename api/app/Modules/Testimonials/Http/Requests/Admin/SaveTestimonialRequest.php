<?php

namespace App\Modules\Testimonials\Http\Requests\Admin;

use App\Support\Enums\PublishStatus;
use App\Support\TranslatedRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveTestimonialRequest extends FormRequest
{
    public function rules(): array
    {
        return TranslatedRules::withEnglish([
            'quote.ar' => ['required', 'string', 'max:600'],
            'author_name.ar' => ['required', 'string', 'max:80'],
            'author_title.ar' => ['required', 'string', 'max:80'],
            'organization.ar' => ['required', 'string', 'max:120'],
            'project_id' => ['nullable', 'integer', Rule::exists('projects', 'id')->withoutTrashed()],
            'status' => ['required', Rule::enum(PublishStatus::class)],
        ]);
    }

    public function attributes(): array
    {
        return TranslatedRules::labels([
            'quote.ar' => 'نص الشهادة',
            'author_name.ar' => 'اسم صاحب الشهادة',
            'author_title.ar' => 'منصبه',
            'organization.ar' => 'الجهة',
            'project_id' => 'المشروع',
            'status' => 'الحالة',
        ]);
    }

    public function messages(): array
    {
        return [
            'project_id.exists' => 'المشروع المختار غير موجود أو محذوف.',
            ...TranslatedRules::messages(),
        ];
    }
}
