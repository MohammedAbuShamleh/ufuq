<?php

namespace App\Modules\Team;

use App\Modules\Team\Models\TeamMember;
use App\Modules\Team\Policies\TeamMemberPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class TeamServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Models live outside App\Models, so policy auto-discovery would miss them.
        Gate::policy(TeamMember::class, TeamMemberPolicy::class);
    }
}
