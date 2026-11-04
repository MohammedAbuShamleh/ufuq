<?php

namespace App\Modules\Team\Http\Controllers;

use App\Modules\Team\Http\Resources\TeamMemberResource;
use App\Modules\Team\Services\TeamDirectory;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class ListTeamController
{
    public function __invoke(TeamDirectory $team, PublicCache $cache): JsonResponse
    {
        return $cache->respond('team', fn () => TeamMemberResource::collection($team->visible()));
    }
}
