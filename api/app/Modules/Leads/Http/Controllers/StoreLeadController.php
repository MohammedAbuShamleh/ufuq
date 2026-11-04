<?php

namespace App\Modules\Leads\Http\Controllers;

use App\Modules\Leads\Http\Requests\StoreLeadRequest;
use App\Modules\Leads\Services\LeadIntake;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreLeadController
{
    public function __invoke(StoreLeadRequest $request, LeadIntake $intake): JsonResponse
    {
        $intake->receive($request->validated(), $request->ip());

        // Same answer whether the honeypot caught a bot or not.
        return JsonResource::make(['received' => true])->response()->setStatusCode(201);
    }
}
