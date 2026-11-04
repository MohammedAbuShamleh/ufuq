<?php

namespace App\Modules\Leads;

use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Policies\LeadPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class LeadsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Models live outside App\Models, so policy auto-discovery would miss them.
        Gate::policy(Lead::class, LeadPolicy::class);
    }
}
