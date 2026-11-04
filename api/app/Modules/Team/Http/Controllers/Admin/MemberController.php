<?php

namespace App\Modules\Team\Http\Controllers\Admin;

use App\Modules\Admin\Http\Requests\ReorderRequest;
use App\Modules\Team\Http\Requests\Admin\SaveMemberRequest;
use App\Modules\Team\Http\Resources\Admin\MemberResource;
use App\Modules\Team\Models\TeamMember;
use App\Modules\Team\Services\TeamEditor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** Authorization is on the routes (TeamMemberPolicy). */
class MemberController
{
    public function __construct(private readonly TeamEditor $team) {}

    public function index(): AnonymousResourceCollection
    {
        return MemberResource::collection($this->team->list());
    }

    public function store(SaveMemberRequest $request): JsonResponse
    {
        return MemberResource::make($this->team->create($request->validated()))
            ->response()
            ->setStatusCode(201);
    }

    public function show(TeamMember $member): MemberResource
    {
        return MemberResource::make($member->load('media'));
    }

    public function update(SaveMemberRequest $request, TeamMember $member): MemberResource
    {
        return MemberResource::make($this->team->update($member, $request->validated()));
    }

    public function destroy(TeamMember $member): Response
    {
        $this->team->delete($member);

        return response()->noContent();
    }

    public function reorder(ReorderRequest $request): Response
    {
        $this->team->reorder($request->ids());

        return response()->noContent();
    }
}
