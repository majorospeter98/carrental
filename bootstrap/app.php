<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\UseClientIpHeader;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // first, so the trusted-proxy step sees the visitor's address
        $middleware->prepend(UseClientIpHeader::class);
        // Render ends HTTPS at its proxy and passes the original scheme in this header
        $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_PROTO);
        $middleware->web(append: [HandleInertiaRequests::class]);
        // before route binding, so the page for a missing car gets the shared props
        $middleware->prependToPriorityList(SubstituteBindings::class, HandleInertiaRequests::class);
        $middleware->redirectGuestsTo('/admin');
        $middleware->redirectUsersTo('/admin/dashboard');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            if ($response->getStatusCode() === 404 && ! $request->expectsJson()) {
                return Inertia::render('NotFound')->toResponse($request)->setStatusCode(404);
            }

            // an expired session: reload the page to get a fresh token
            if ($response->getStatusCode() === 419) {
                return back();
            }

            return $response;
        });
    })->create();
