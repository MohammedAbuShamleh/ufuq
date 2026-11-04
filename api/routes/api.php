<?php

use App\Http\Controllers\HomeController;
use App\Modules\Leads\Http\Controllers\StoreLeadController;
use App\Modules\Portfolio\Http\Controllers\ListProjectsController;
use App\Modules\Portfolio\Http\Controllers\ShowProjectController;
use App\Modules\Site\Http\Controllers\ShowSettingsController;
use App\Modules\Team\Http\Controllers\ListTeamController;
use Illuminate\Support\Facades\Route;

// Public API, served under /v1. No auth; reads are cached for five minutes.
Route::get('home', HomeController::class);
Route::get('projects', ListProjectsController::class);
Route::get('projects/{slug}', ShowProjectController::class)->where('slug', '[a-z0-9-]+');
Route::get('team', ListTeamController::class);
Route::get('settings', ShowSettingsController::class);

Route::post('leads', StoreLeadController::class)->middleware('throttle:5,1');
