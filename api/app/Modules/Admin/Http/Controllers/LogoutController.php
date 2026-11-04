<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Modules\Admin\Services\AdminLogin;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LogoutController
{
    public function __invoke(Request $request, AdminLogin $login): Response
    {
        $login->logout($request->session());

        return response()->noContent();
    }
}
