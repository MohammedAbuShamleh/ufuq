<?php

use App\Models\User;
use App\Modules\Admin\Http\Controllers\LoginController;
use App\Modules\Admin\Http\Controllers\LogoutController;
use App\Modules\Admin\Http\Controllers\MeController;
use App\Modules\Admin\Http\Controllers\UserController;
use App\Modules\Clients\Http\Controllers\Admin\ClientController;
use App\Modules\Clients\Http\Controllers\Admin\ClientLogoController;
use App\Modules\Clients\Models\Client;
use App\Modules\Leads\Http\Controllers\Admin\LeadController;
use App\Modules\Leads\Models\Lead;
use App\Modules\Portfolio\Http\Controllers\Admin\ProjectController;
use App\Modules\Portfolio\Http\Controllers\Admin\ProjectScreenController;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Models\ProjectScreen;
use App\Modules\Site\Http\Controllers\Admin\FaqController;
use App\Modules\Site\Http\Controllers\Admin\SettingsController;
use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use App\Modules\Team\Http\Controllers\Admin\MemberController;
use App\Modules\Team\Http\Controllers\Admin\MemberPhotoController;
use App\Modules\Team\Models\TeamMember;
use App\Modules\Testimonials\Http\Controllers\Admin\TestimonialController;
use App\Modules\Testimonials\Models\Testimonial;
use Illuminate\Support\Facades\Route;

/*
| Dashboard API, served under /admin/v1 with a Sanctum cookie session (see
| bootstrap/app.php). Every route names the policy ability it needs, so a
| request is refused before validation runs.
*/

Route::post('login', LoginController::class)->middleware('throttle:admin-login')->name('login');

Route::middleware('auth:sanctum')->where([
    'project' => '[0-9]+',
    'screen' => '[0-9]+',
    'member' => '[0-9]+',
    'testimonial' => '[0-9]+',
    'client' => '[0-9]+',
    'faq' => '[0-9]+',
    'lead' => '[0-9]+',
    'user' => '[0-9]+',
])->group(function () {
    Route::post('logout', LogoutController::class)->name('logout');
    Route::get('me', MeController::class)->name('me');

    // Projects
    Route::controller(ProjectController::class)->prefix('projects')->name('projects.')->group(function () {
        Route::get('/', 'index')->name('index')->can('viewAny', Project::class);
        Route::post('/', 'store')->name('store')->can('create', Project::class);
        Route::post('reorder', 'reorder')->name('reorder')->can('reorder', Project::class);
        Route::get('{project}', 'show')->name('show')->can('view', 'project');
        Route::put('{project}', 'update')->name('update')->can('update', 'project');
        Route::delete('{project}', 'destroy')->name('destroy')->can('delete', 'project');
    });

    // A screen belongs to the project in its URL; any other id is a 404.
    Route::controller(ProjectScreenController::class)->prefix('projects/{project}/screens')->name('projects.screens.')->scopeBindings()->group(function () {
        Route::post('/', 'store')->name('store')->can('create', ProjectScreen::class);
        Route::post('reorder', 'reorder')->name('reorder')->can('reorder', ProjectScreen::class);
        Route::patch('{screen}', 'update')->name('update')->can('update', 'screen');
        Route::delete('{screen}', 'destroy')->name('destroy')->can('delete', 'screen');
    });

    // Team
    Route::controller(MemberController::class)->prefix('team')->name('team.')->group(function () {
        Route::get('/', 'index')->name('index')->can('viewAny', TeamMember::class);
        Route::post('/', 'store')->name('store')->can('create', TeamMember::class);
        Route::post('reorder', 'reorder')->name('reorder')->can('reorder', TeamMember::class);
        Route::get('{member}', 'show')->name('show')->can('view', 'member');
        Route::put('{member}', 'update')->name('update')->can('update', 'member');
        Route::delete('{member}', 'destroy')->name('destroy')->can('delete', 'member');
    });
    Route::controller(MemberPhotoController::class)->prefix('team/{member}/photo')->name('team.photo.')->group(function () {
        Route::post('/', 'store')->name('store')->can('update', 'member');
        Route::delete('/', 'destroy')->name('destroy')->can('update', 'member');
    });

    // Testimonials
    Route::controller(TestimonialController::class)->prefix('testimonials')->name('testimonials.')->group(function () {
        Route::get('/', 'index')->name('index')->can('viewAny', Testimonial::class);
        Route::post('/', 'store')->name('store')->can('create', Testimonial::class);
        Route::post('reorder', 'reorder')->name('reorder')->can('reorder', Testimonial::class);
        Route::get('{testimonial}', 'show')->name('show')->can('view', 'testimonial');
        Route::put('{testimonial}', 'update')->name('update')->can('update', 'testimonial');
        Route::delete('{testimonial}', 'destroy')->name('destroy')->can('delete', 'testimonial');
    });

    // Clients
    Route::controller(ClientController::class)->prefix('clients')->name('clients.')->group(function () {
        Route::get('/', 'index')->name('index')->can('viewAny', Client::class);
        Route::post('/', 'store')->name('store')->can('create', Client::class);
        Route::post('reorder', 'reorder')->name('reorder')->can('reorder', Client::class);
        Route::get('{client}', 'show')->name('show')->can('view', 'client');
        Route::put('{client}', 'update')->name('update')->can('update', 'client');
        Route::delete('{client}', 'destroy')->name('destroy')->can('delete', 'client');
    });
    Route::controller(ClientLogoController::class)->prefix('clients/{client}/logo')->name('clients.logo.')->group(function () {
        Route::post('/', 'store')->name('store')->can('update', 'client');
        Route::delete('/', 'destroy')->name('destroy')->can('update', 'client');
    });

    // FAQs
    Route::controller(FaqController::class)->prefix('faqs')->name('faqs.')->group(function () {
        Route::get('/', 'index')->name('index')->can('viewAny', Faq::class);
        Route::post('/', 'store')->name('store')->can('create', Faq::class);
        Route::post('reorder', 'reorder')->name('reorder')->can('reorder', Faq::class);
        Route::get('{faq}', 'show')->name('show')->can('view', 'faq');
        Route::put('{faq}', 'update')->name('update')->can('update', 'faq');
        Route::delete('{faq}', 'destroy')->name('destroy')->can('delete', 'faq');
    });

    // Settings (admin only)
    Route::controller(SettingsController::class)->prefix('settings')->name('settings.')->group(function () {
        Route::get('/', 'show')->name('show')->can('view', Setting::class);
        Route::put('/', 'update')->name('update')->can('update', Setting::class);
        Route::post('profile-pdf', 'storeProfilePdf')->name('profile-pdf.store')->can('update', Setting::class);
        Route::delete('profile-pdf', 'destroyProfilePdf')->name('profile-pdf.destroy')->can('update', Setting::class);
    });

    // Leads: read and move forward only.
    Route::controller(LeadController::class)->prefix('leads')->name('leads.')->group(function () {
        Route::get('/', 'index')->name('index')->can('viewAny', Lead::class);
        Route::get('{lead}', 'show')->name('show')->can('view', 'lead');
        Route::patch('{lead}/status', 'updateStatus')->name('status')->can('changeStatus', 'lead');
    });

    // Users (admin only)
    Route::controller(UserController::class)->prefix('users')->name('users.')->group(function () {
        Route::get('/', 'index')->name('index')->can('viewAny', User::class);
        Route::post('/', 'store')->name('store')->can('create', User::class);
        Route::get('{user}', 'show')->name('show')->can('view', 'user');
        Route::put('{user}', 'update')->name('update')->can('update', 'user');
        Route::delete('{user}', 'destroy')->name('destroy')->can('delete', 'user');
    });
});
