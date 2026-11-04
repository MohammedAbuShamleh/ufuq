<?php

namespace App\Modules\Admin\Services;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/** Dashboard accounts. The guards keep at least one admin able to sign in. */
class UserManager
{
    public const PASSWORD_MIN = 10;

    /** @return Collection<int, User> */
    public function list(): Collection
    {
        return User::query()->orderBy('id')->get();
    }

    /** @param  array{name: string, email: string, role: string, password: string}  $data */
    public function create(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => UserRole::from($data['role']),
            'password' => $data['password'],
        ]);
    }

    /** @param  array{name: string, email: string, role: string, password?: ?string}  $data */
    public function update(User $user, array $data, User $actor): User
    {
        return DB::transaction(function () use ($user, $data, $actor) {
            $role = UserRole::from($data['role']);

            if ($user->role === UserRole::Admin && $role !== UserRole::Admin) {
                $this->guardLastAdmin('role', 'لا يمكن سحب صلاحية المدير من آخر مدير في النظام.');

                if ($user->is($actor)) {
                    throw ValidationException::withMessages(['role' => 'لا يمكنك سحب صلاحية المدير من حسابك.']);
                }
            }

            $user->fill(['name' => $data['name'], 'email' => $data['email'], 'role' => $role]);

            if (filled($data['password'] ?? null)) {
                $user->password = $data['password'];
            }

            $user->save();

            return $user;
        });
    }

    public function delete(User $user, User $actor): void
    {
        DB::transaction(function () use ($user, $actor) {
            if ($user->role === UserRole::Admin) {
                $this->guardLastAdmin('user', 'لا يمكن حذف آخر مدير في النظام.');
            }

            if ($user->is($actor)) {
                throw ValidationException::withMessages(['user' => 'لا يمكنك حذف حسابك.']);
            }

            $user->delete();
        });
    }

    /** Locks the admin rows, so two concurrent demotions cannot both pass the count. */
    private function guardLastAdmin(string $field, string $message): void
    {
        $admins = User::query()->where('role', UserRole::Admin)->lockForUpdate()->count();

        if ($admins <= 1) {
            throw ValidationException::withMessages([$field => $message]);
        }
    }
}
