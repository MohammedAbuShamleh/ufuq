<?php

namespace App\Modules\Portfolio;

use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Models\ProjectScreen;
use App\Modules\Portfolio\Policies\ProjectPolicy;
use App\Modules\Portfolio\Policies\ProjectScreenPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class PortfolioServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Models live outside App\Models, so policy auto-discovery would miss them.
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(ProjectScreen::class, ProjectScreenPolicy::class);
    }
}
