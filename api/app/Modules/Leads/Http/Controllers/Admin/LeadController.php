<?php

namespace App\Modules\Leads\Http\Controllers\Admin;

use App\Modules\Leads\Http\Requests\Admin\ChangeLeadStatusRequest;
use App\Modules\Leads\Http\Requests\Admin\ListLeadsRequest;
use App\Modules\Leads\Http\Resources\Admin\LeadCollection;
use App\Modules\Leads\Http\Resources\Admin\LeadResource;
use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Services\LeadDesk;

/** Authorization is on the routes (LeadPolicy). Leads are never edited or deleted here. */
class LeadController
{
    public function __construct(private readonly LeadDesk $desk) {}

    public function index(ListLeadsRequest $request): LeadCollection
    {
        return (new LeadCollection($this->desk->page($request->status())))
            ->additional(['counts' => $this->desk->counts()]);
    }

    public function show(Lead $lead): LeadResource
    {
        return LeadResource::make($lead);
    }

    public function updateStatus(ChangeLeadStatusRequest $request, Lead $lead): LeadResource
    {
        return LeadResource::make($this->desk->moveTo($lead, $request->status()));
    }
}
