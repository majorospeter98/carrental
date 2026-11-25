<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SessionController extends Controller
{
    private const MAX_ATTEMPTS = 5;

    public function create(): Response
    {
        return Inertia::render('Admin');
    }

    public function store(Request $request): RedirectResponse
    {
        $key = 'login:'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            throw ValidationException::withMessages(['login' => 'tooMany']);
        }

        $credentials = [
            'username' => (string) $request->input('username'),
            'password' => (string) $request->input('password'),
        ];

        if (! Auth::attempt($credentials)) {
            RateLimiter::hit($key);

            throw ValidationException::withMessages(['login' => 'loginError']);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();

        return redirect()->intended(route('admin.bookings'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        // so the back button cannot show renters' data after logging out
        Inertia::clearHistory();

        return to_route('login');
    }
}
