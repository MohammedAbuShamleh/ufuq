<?php

namespace App\Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** Drag-and-drop order for any sortable list; SortOrder checks the ids belong to the list. */
class ReorderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'ids' => ['required', 'list', 'max:500'],
            'ids.*' => ['required', 'integer', 'distinct'],
        ];
    }

    public function attributes(): array
    {
        return [
            'ids' => 'الترتيب',
            'ids.*' => 'رقم العنصر',
        ];
    }

    /** @return list<int> */
    public function ids(): array
    {
        return array_map(intval(...), $this->validated('ids'));
    }
}
