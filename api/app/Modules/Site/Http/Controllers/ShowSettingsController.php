<?php

namespace App\Modules\Site\Http\Controllers;

use App\Modules\Site\Http\Resources\SettingsResource;
use App\Modules\Site\Services\SiteSettings;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class ShowSettingsController
{
    public function __invoke(SiteSettings $site, PublicCache $cache): JsonResponse
    {
        return $cache->respond('settings', fn () => SettingsResource::make($site->all()));
    }
}
