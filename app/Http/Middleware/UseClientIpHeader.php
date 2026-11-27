<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/*
 * Behind a proxy every visitor has the proxy's address, so they would share the rate limits.
 * CLIENT_IP_HEADER names a header holding the visitor's address. Set it only to a header the
 * proxy always overwrites: otherwise visitors can send any address and avoid the limits.
 */
class UseClientIpHeader
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = config('app.client_ip_header');
        $ip = $header ? $request->headers->get($header) : null;

        if ($ip && filter_var($ip, FILTER_VALIDATE_IP)) {
            $request->server->set('REMOTE_ADDR', $ip);
        }

        return $next($request);
    }
}
