<?php

namespace App\Http\Middleware;

use Inertia\Middleware;

/* Inertia adds the validation errors to every page itself. */
class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';
}
