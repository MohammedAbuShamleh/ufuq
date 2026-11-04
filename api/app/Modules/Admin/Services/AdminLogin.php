<?php

namespace App\Modules\Admin\Services;

use App\Models\User;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Contracts\Session\Session;
use Illuminate\Validation\ValidationException;

/** Cookie-session sign-in for the dashboard (Sanctum SPA mode, web guard). */
class AdminLogin
{
    public function __construct(private readonly Auth $auth) {}

    public function login(string $email, string $password, bool $remember, Session $session): User
    {
        $guard = $this->auth->guard('web');

        if (! $guard->attempt(['email' => $email, 'password' => $password], $remember)) {
            // One message for both cases, so the form does not reveal which emails exist.
            throw ValidationException::withMessages(['email' => trans('auth.failed')]);
        }

        // A new session id on sign-in, so an id planted before login is worthless.
        $session->regenerate();

        return $guard->user();
    }

    public function logout(Session $session): void
    {
        $this->auth->guard('web')->logout();

        $session->invalidate();
        $session->regenerateToken();
    }
}
