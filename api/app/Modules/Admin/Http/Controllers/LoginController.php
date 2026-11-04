<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Modules\Admin\Http\Requests\LoginRequest;
use App\Modules\Admin\Http\Resources\UserResource;
use App\Modules\Admin\Services\AdminLogin;

class LoginController
{
    public function __invoke(LoginRequest $request, AdminLogin $login): UserResource
    {
        return UserResource::make($login->login(
            $request->validated('email'),
            $request->validated('password'),
            $request->boolean('remember'),
            $request->session(),
        ));
    }
}
