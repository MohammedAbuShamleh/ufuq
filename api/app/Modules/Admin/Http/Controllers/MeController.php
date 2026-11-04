<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Modules\Admin\Http\Resources\UserResource;
use Illuminate\Http\Request;

class MeController
{
    public function __invoke(Request $request): UserResource
    {
        return UserResource::make($request->user());
    }
}
