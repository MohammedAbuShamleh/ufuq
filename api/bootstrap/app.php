<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'v1',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // The dashboard API. Sessions (and CSRF) apply here only, and only for the
            // origins in SANCTUM_STATEFUL_DOMAINS: the public /v1 contact form posts
            // from the site's origin and must stay session- and CSRF-free.
            Route::middleware(['api', EnsureFrontendRequestsAreStateful::class])
                ->prefix('admin/v1')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        // There is no login page to redirect to: guests get a JSON 401 (rendered below).
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // The API answers in JSON whatever the client's Accept header says.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('v1/*', 'admin/v1/*') || $request->expectsJson(),
        );

        // The default 404 message names the model class; the site only needs the status.
        $exceptions->render(fn (NotFoundHttpException $e, Request $request) => match (true) {
            $request->is('v1/*') => response()->json(['message' => 'Not found.'], 404),
            $request->is('admin/v1/*') => response()->json(['message' => 'العنصر غير موجود.'], 404),
            default => null,
        });

        // The dashboard shows these messages to people as they are, so they are in Arabic.
        $exceptions->render(fn (AuthenticationException $e, Request $request) => $request->is('admin/v1/*')
            ? response()->json(['message' => 'سجّل الدخول أولاً.'], 401)
            : null);

        $exceptions->render(fn (AccessDeniedHttpException $e, Request $request) => $request->is('admin/v1/*')
            ? response()->json(['message' => 'لا تملك صلاحية هذا الإجراء.'], 403)
            : null);

        // An expired CSRF token arrives here as a 419 HttpException.
        $exceptions->render(fn (HttpException $e, Request $request) => $request->is('admin/v1/*') && $e->getStatusCode() === 419
            ? response()->json(['message' => 'انتهت الجلسة، حدّث الصفحة وحاول مجدداً.'], 419)
            : null);
    })->create();
