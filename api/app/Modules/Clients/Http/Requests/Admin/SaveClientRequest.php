<?php

namespace App\Modules\Clients\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SaveClientRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name.ar' => ['required', 'string', 'max:120'],
            'sector_label.ar' => ['required', 'string', 'max:60'],
            'location.ar' => ['required', 'string', 'max:60'],
            'is_visible' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name.ar' => 'اسم العميل',
            'sector_label.ar' => 'المجال',
            'location.ar' => 'المكان',
            'is_visible' => 'ظاهر في الموقع',
        ];
    }
}
