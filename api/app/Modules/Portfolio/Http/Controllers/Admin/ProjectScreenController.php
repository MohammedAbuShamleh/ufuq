<?php

namespace App\Modules\Portfolio\Http\Controllers\Admin;

use App\Modules\Admin\Http\Requests\ReorderRequest;
use App\Modules\Portfolio\Http\Requests\Admin\StoreScreenRequest;
use App\Modules\Portfolio\Http\Requests\Admin\UpdateScreenRequest;
use App\Modules\Portfolio\Http\Resources\Admin\ScreenResource;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Models\ProjectScreen;
use App\Modules\Portfolio\Services\ScreenEditor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/** Authorization is on the routes (ProjectScreenPolicy); {screen} is scoped to {project}. */
class ProjectScreenController
{
    public function __construct(private readonly ScreenEditor $screens) {}

    public function store(StoreScreenRequest $request, Project $project): JsonResponse
    {
        $screen = $this->screens->upload($project, $request->safe()->except('file'), $request->file('file'));

        return ScreenResource::make($screen)->response()->setStatusCode(201);
    }

    public function update(UpdateScreenRequest $request, Project $project, ProjectScreen $screen): ScreenResource
    {
        return ScreenResource::make($this->screens->update($project, $screen, $request->validated()));
    }

    public function destroy(Project $project, ProjectScreen $screen): Response
    {
        $this->screens->delete($project, $screen);

        return response()->noContent();
    }

    public function reorder(ReorderRequest $request, Project $project): Response
    {
        $this->screens->reorder($project, $request->ids());

        return response()->noContent();
    }
}
