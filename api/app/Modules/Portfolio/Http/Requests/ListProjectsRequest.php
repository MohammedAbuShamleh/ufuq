<?php

namespace App\Modules\Portfolio\Http\Requests;

use App\Modules\Portfolio\Enums\ProjectSector;
use App\Modules\Portfolio\Enums\ProjectType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListProjectsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'type' => ['nullable', Rule::enum(ProjectType::class)],
            'sector' => ['nullable', Rule::enum(ProjectSector::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'type.enum' => 'نوع المشروع غير معروف.',
            'sector.enum' => 'القطاع غير معروف.',
        ];
    }

    public function type(): ?ProjectType
    {
        return $this->enum('type', ProjectType::class);
    }

    public function sector(): ?ProjectSector
    {
        return $this->enum('sector', ProjectSector::class);
    }
}
