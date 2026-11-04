<?php

namespace App\Modules\Leads\Http\Requests\Admin;

use App\Modules\Leads\Enums\LeadStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeLeadStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(LeadStatus::class)],
        ];
    }

    public function attributes(): array
    {
        return ['status' => 'الحالة'];
    }

    public function status(): LeadStatus
    {
        return LeadStatus::from($this->validated('status'));
    }
}
