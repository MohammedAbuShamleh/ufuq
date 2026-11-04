<?php

namespace App\Modules\Team\Http\Controllers\Admin;

use App\Modules\Team\Http\Requests\Admin\UploadPhotoRequest;
use App\Modules\Team\Http\Resources\Admin\MemberResource;
use App\Modules\Team\Models\TeamMember;
use App\Modules\Team\Services\TeamEditor;

/** Authorization is on the routes (TeamMemberPolicy::update). */
class MemberPhotoController
{
    public function __construct(private readonly TeamEditor $team) {}

    public function store(UploadPhotoRequest $request, TeamMember $member): MemberResource
    {
        return MemberResource::make($this->team->setPhoto($member, $request->file('photo')));
    }

    public function destroy(TeamMember $member): MemberResource
    {
        return MemberResource::make($this->team->removePhoto($member));
    }
}
