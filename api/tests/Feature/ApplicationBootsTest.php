<?php

namespace Tests\Feature;

use App\Modules\Clients\ClientsServiceProvider;
use App\Modules\Leads\LeadsServiceProvider;
use App\Modules\Portfolio\PortfolioServiceProvider;
use App\Modules\Site\SiteServiceProvider;
use App\Modules\Team\TeamServiceProvider;
use App\Modules\Testimonials\TestimonialsServiceProvider;
use Tests\TestCase;

class ApplicationBootsTest extends TestCase
{
    public function test_health_endpoint_responds(): void
    {
        $this->get('/up')->assertOk();
    }

    public function test_all_six_modules_are_registered(): void
    {
        $modules = [
            PortfolioServiceProvider::class,
            TeamServiceProvider::class,
            TestimonialsServiceProvider::class,
            ClientsServiceProvider::class,
            SiteServiceProvider::class,
            LeadsServiceProvider::class,
        ];

        foreach ($modules as $provider) {
            $this->assertNotEmpty($this->app->getProviders($provider), "{$provider} is not registered");
        }
    }
}
