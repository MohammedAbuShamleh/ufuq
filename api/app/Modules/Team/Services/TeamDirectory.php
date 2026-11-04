<?php

namespace App\Modules\Team\Services;

use App\Modules\Team\Models\TeamMember;
use Illuminate\Database\Eloquent\Collection;

class TeamDirectory
{
    /** @return Collection<int, TeamMember> */
    public function visible(): Collection
    {
        return TeamMember::visible()->with('media')->orderBy('sort_order')->get();
    }
}
