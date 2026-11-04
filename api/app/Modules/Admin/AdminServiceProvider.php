<?php

namespace App\Modules\Admin;

use App\Models\User;
use App\Modules\Admin\Console\CreateUserCommand;
use App\Modules\Admin\Policies\UserPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

/** The dashboard's door: sign-in, the user accounts, and what every admin route shares. */
class AdminServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // User lives in App\Models, but its policy lives here, so register it by hand.
        Gate::policy(User::class, UserPolicy::class);

        // The dashboard signs in with a session cookie only. There is no tokens
        // table, so a bearer header must never reach a token lookup.
        Sanctum::getAccessTokenFromRequestUsing(fn () => null);

        // Per email and address: guessing one account's password is slow, and one
        // office sharing an address does not lock out a colleague.
        RateLimiter::for('admin-login', fn (Request $request) => Limit::perMinute(5)
            ->by(Str::lower((string) $request->input('email')).'|'.$request->ip())
            ->response(fn (Request $request, array $headers) => response()->json(
                ['message' => trans('auth.throttle', ['seconds' => $headers['Retry-After'] ?? 60])],
                429,
                $headers,
            )));

        if ($this->app->runningInConsole()) {
            $this->commands([CreateUserCommand::class]);
        }
    }
}
