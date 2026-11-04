<?php

namespace App\Modules\Clients;

use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Policies\ClientPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class ClientsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Models live outside App\Models, so policy auto-discovery would miss them.
        Gate::policy(Client::class, ClientPolicy::class);
    }
}
