<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Two dashboard accounts for local development only. The passwords below are
 * public by being in the repository, so this refuses to run anywhere but
 * local; production gets its first admin from `php artisan users:create`.
 */
class DevUsersSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command?->warn('DevUsersSeeder runs in the local environment only; skipping.');

            return;
        }

        $accounts = [
            ['name' => 'مدير تجريبي', 'email' => 'admin@ufuq.test', 'role' => UserRole::Admin, 'password' => 'ufuq-admin-local'],
            ['name' => 'محرر تجريبي', 'email' => 'editor@ufuq.test', 'role' => UserRole::Editor, 'password' => 'ufuq-editor-local'],
        ];

        foreach ($accounts as $account) {
            // Reset on every run, so the documented password always works locally.
            User::updateOrCreate(['email' => $account['email']], $account);
        }
    }
}
