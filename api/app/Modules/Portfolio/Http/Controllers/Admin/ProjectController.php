<?php

namespace App\Modules\Portfolio\Http\Controllers\Admin;

use App\Modules\Admin\Http\Requests\ReorderRequest;
use App\Modules\Portfolio\Http\Requests\Admin\SaveProjectRequest;
use App\Modules\Portfolio\Http\Resources\Admin\ProjectResource;
use App\Modules\Portfolio\Http\Resources\Admin\ProjectRowResource;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Services\ProjectEditor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** Authorization is on the routes (ProjectPolicy). */
class ProjectController
{
    public function __construct(private readonly ProjectEditor $projects) {}

    public function index(): AnonymousResourceCollection
    {
        return ProjectRowResource::collection($this->projects->list());
    }

    public function store(SaveProjectRequest $request): JsonResponse
    {
        return ProjectResource::make($this->projects->create($request->validated()))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Project $project): ProjectResource
    {
        return ProjectResource::make($this->projects->load($project));
    }

    public function update(SaveProjectRequest $request, Project $project): ProjectResource
    {
        return ProjectResource::make($this->projects->update($project, $request->validated()));
    }

    public function destroy(Project $project): Response
    {
        $this->projects->delete($project);

        return response()->noContent();
    }

    public function reorder(ReorderRequest $request): Response
    {
        $this->projects->reorder($request->ids());

        return response()->noContent();
    }
}
