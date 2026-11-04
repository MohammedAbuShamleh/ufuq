<?php

namespace App\Modules\Leads\Http\Requests\Admin;

use App\Modules\Leads\Enums\LeadStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListLeadsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::enum(LeadStatus::class)],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => 'الحالة',
            'page' => 'رقم الصفحة',
        ];
    }

    public function status(): ?LeadStatus
    {
        return $this->enum('status', LeadStatus::class);
    }
}
