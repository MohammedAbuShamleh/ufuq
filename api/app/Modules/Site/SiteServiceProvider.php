<?php

namespace App\Modules\Site;

use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use App\Modules\Site\Policies\FaqPolicy;
use App\Modules\Site\Policies\SettingPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class SiteServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Models live outside App\Models, so policy auto-discovery would miss them.
        Gate::policy(Faq::class, FaqPolicy::class);
        Gate::policy(Setting::class, SettingPolicy::class);
    }
}
