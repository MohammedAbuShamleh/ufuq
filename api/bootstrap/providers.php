<?php

use App\Modules\Admin\AdminServiceProvider;
use App\Modules\Clients\ClientsServiceProvider;
use App\Modules\Leads\LeadsServiceProvider;
use App\Modules\Portfolio\PortfolioServiceProvider;
use App\Modules\Site\SiteServiceProvider;
use App\Modules\Team\TeamServiceProvider;
use App\Modules\Testimonials\TestimonialsServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    PortfolioServiceProvider::class,
    TeamServiceProvider::class,
    TestimonialsServiceProvider::class,
    ClientsServiceProvider::class,
    SiteServiceProvider::class,
    LeadsServiceProvider::class,
    AdminServiceProvider::class,
];
