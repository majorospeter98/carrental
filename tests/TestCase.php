<?php

namespace Tests;

use App\Models\Booking;
use App\Models\Car;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /* a booking already in the database; the seeder makes none */
    protected function booked(Car $car, int $first, int $last, string $name = 'Minta Anna'): Booking
    {
        return $car->bookings()->create([
            'name' => $name,
            'email' => 'minta@example.com',
            'phone' => '36301234567',
            'address' => 'Minta utca 1.',
            'from_date' => today()->addDays($first)->toDateString(),
            'to_date' => today()->addDays($last)->toDateString(),
            'days' => $last - $first + 1,
            'price' => ($last - $first + 1) * $car->price_per_day,
        ]);
    }
}
