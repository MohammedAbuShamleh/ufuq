<?php

namespace App\Modules\Admin\Http\Requests;

use App\Enums\UserRole;
use App\Models\User;
use App\Modules\Admin\Services\UserManager;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/** Create and update: the password is required only for a new account. */
class SaveUserRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => Str::lower(trim($this->input('email')))]);
        }
    }

    public function rules(): array
    {
        /** @var User|null $account */
        $account = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($account?->id)],
            'role' => ['required', Rule::enum(UserRole::class)],
            'password' => [$account ? 'nullable' : 'required', 'string', 'min:'.UserManager::PASSWORD_MIN, 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'الاسم',
            'email' => 'البريد الإلكتروني',
            'role' => 'الصلاحية',
            'password' => 'كلمة المرور',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'هذا البريد مستخدم لحساب آخر.',
        ];
    }
}
