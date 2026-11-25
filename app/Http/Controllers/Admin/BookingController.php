<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'rents' => Booking::with('car')->orderBy('from_date')->orderBy('id')->get()->map(fn (Booking $booking) => [
                'id' => $booking->id,
                'name' => $booking->name,
                'email' => $booking->email,
                'phone' => $booking->phone,
                'address' => $booking->address,
                'from' => $booking->from_date,
                'to' => $booking->to_date,
                'days' => $booking->days,
                'price' => $booking->price,
                'car' => "{$booking->car->brand} {$booking->car->model}",
            ]),
        ]);
    }

    public function clear(Request $request): RedirectResponse
    {
        Booking::query()->delete();
        $request->session()->forget('last_booking');

        return to_route('admin.bookings');
    }
}
