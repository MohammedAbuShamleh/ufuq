<?php

namespace App\Modules\Admin\Console;

use App\Enums\UserRole;
use App\Modules\Admin\Services\UserManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Creates a dashboard account from the server shell: how production gets its
 * first admin, since only an admin can add users from the dashboard.
 */
class CreateUserCommand extends Command
{
    protected $signature = 'users:create';

    protected $description = 'Create a dashboard account (admin or editor)';

    public function handle(UserManager $users): int
    {
        $data = [
            'name' => trim((string) $this->ask('Name')),
            'email' => Str::lower(trim((string) $this->ask('Email'))),
            'role' => $this->choice('Role', array_column(UserRole::cases(), 'value'), UserRole::Admin->value),
            'password' => (string) $this->secret('Password (at least '.UserManager::PASSWORD_MIN.' characters)'),
            'password_confirmation' => (string) $this->secret('Confirm password'),
        ];

        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'role' => ['required', Rule::enum(UserRole::class)],
            'password' => ['required', 'string', 'min:'.UserManager::PASSWORD_MIN, 'max:255', 'confirmed'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = $users->create($validator->validated());

        $this->info("Created {$user->role->value} account {$user->email}.");

        return self::SUCCESS;
    }
}
