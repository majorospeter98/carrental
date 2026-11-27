<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Car;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function create(Car $car): Response
    {
        return Inertia::render('Rents', ['car' => $car->toPublic()]);
    }

    public function store(StoreBookingRequest $request, Car $car): RedirectResponse
    {
        $data = $request->validated();

        // check and insert together, so two requests cannot take the same days
        $booking = DB::transaction(function () use ($car, $data) {
            Car::whereKey($car->id)->lockForUpdate()->first();

            if ($car->bookings()->overlapping($data['from'], $data['to'])->exists()) {
                throw ValidationException::withMessages(['range' => 'taken']);
            }

            // days and price are worked out here, never taken from the browser
            $days = (int) Carbon::parse($data['from'])->diffInDays($data['to']) + 1;

            return $car->bookings()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'from_date' => $data['from'],
                'to_date' => $data['to'],
                'days' => $days,
                'price' => $days * $car->price_per_day,
            ]);
        });

        $request->session()->put('last_booking', $booking->id);

        return to_route('done');
    }

    /* Only the visitor who booked can see the confirmation: its id lives in their session. */
    public function done(Request $request): Response|RedirectResponse
    {
        $booking = Booking::with('car.bookings')->find($request->session()->get('last_booking'));

        if (! $booking) {
            return to_route('main');
        }

        return Inertia::render('Done', [
            'rent' => [
                'from' => $booking->from_date,
                'to' => $booking->to_date,
                'days' => $booking->days,
                'price' => $booking->price,
            ],
            'car' => $booking->car->toPublic(),
        ]);
    }
}
