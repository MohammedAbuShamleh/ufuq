<?php

namespace App\Http\Controllers;

use App\Http\Resources\HomeResource;
use App\Modules\Clients\Services\ClientWall;
use App\Modules\Portfolio\Services\ProjectCatalog;
use App\Modules\Site\Services\SiteSettings;
use App\Modules\Team\Services\TeamDirectory;
use App\Modules\Testimonials\Services\TestimonialFeed;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

/** The home page reads from every module, so it sits above them, not inside one. */
class HomeController
{
    public function __invoke(
        ProjectCatalog $projects,
        ClientWall $clients,
        TestimonialFeed $testimonials,
        TeamDirectory $team,
        SiteSettings $site,
        PublicCache $cache,
    ): JsonResponse {
        return $cache->respond('home', fn () => HomeResource::make([
            'featured' => $projects->featured(),
            'projects' => $projects->others(),
            'clients' => $clients->visible(),
            'testimonials' => $testimonials->published(),
            'team' => $team->visible(),
            'faqs' => $site->faqs(),
            'settings' => $site->all(),
        ]));
    }
}
