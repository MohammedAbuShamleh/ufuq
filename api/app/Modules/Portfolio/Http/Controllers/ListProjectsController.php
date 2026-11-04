<?php

namespace App\Modules\Portfolio\Http\Controllers;

use App\Modules\Portfolio\Http\Requests\ListProjectsRequest;
use App\Modules\Portfolio\Http\Resources\ProjectCardResource;
use App\Modules\Portfolio\Services\ProjectCatalog;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class ListProjectsController
{
    public function __invoke(ListProjectsRequest $request, ProjectCatalog $catalog, PublicCache $cache): JsonResponse
    {
        $type = $request->type();
        $sector = $request->sector();

        return $cache->respond(
            "projects:{$type?->value}:{$sector?->value}",
            fn () => ProjectCardResource::collection($catalog->list($type, $sector)),
        );
    }
}
