<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Page;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    private Car $golf;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->golf = Car::where('model', 'Golf')->firstOrFail();
    }

    private function day(int $offset): string
    {
        return today()->addDays($offset)->toDateString();
    }

    private function renter(array $changes = []): array
    {
        return [
            'from' => $this->day(0),
            'to' => $this->day(2),
            'name' => 'Teszt Elek',
            'email' => 'a@b.hu',
            'phone' => '+36 30 123 4567',
            'address' => 'Utca 1.',
            ...$changes,
        ];
    }

    private function book(array $changes = [])
    {
        return $this->post("/rents/{$this->golf->id}", $this->renter($changes));
    }

    public function test_the_home_page_lists_cars_without_personal_data(): void
    {
        $this->get('/main')
            ->assertOk()
            ->assertInertia(fn (Page $page) => $page
                ->component('MainPage')
                ->has('cars', 3)
                ->has('cars.0.bookings.0', fn (Page $booking) => $booking->has('from')->has('to')))
            ->assertDontSee('demo@example.com')
            ->assertDontSee('Minta');

        $this->get('/')->assertRedirect('/main');
    }

    public function test_a_booking_is_saved_with_the_price_worked_out_on_the_server(): void
    {
        $this->book(['price' => 1, 'days' => 99])->assertRedirect('/done');

        $booking = Booking::latest('id')->first();
        $this->assertSame(3, $booking->days);
        $this->assertSame(36000, $booking->price);
        $this->assertFalse($booking->is_demo);

        $this->get('/done')->assertInertia(fn (Page $page) => $page
            ->component('Done')
            ->where('rent.price', 36000)
            ->where('car.model', 'Golf')
            ->missing('rent.email'));
    }

    public function test_the_same_days_cannot_be_booked_twice(): void
    {
        $this->book()->assertRedirect('/done');
        // sharing only the return day is already a clash
        $this->book(['from' => $this->day(2), 'to' => $this->day(4)])->assertSessionHasErrors(['range' => 'taken']);
        $this->book(['from' => $this->day(3), 'to' => $this->day(4)])->assertRedirect('/done');

        $this->assertSame(3, $this->golf->bookings()->count());
    }

    public function test_bad_input_is_refused_with_translatable_codes(): void
    {
        $this->book(['from' => $this->day(-1)])->assertSessionHasErrors(['from' => 'badFrom']);
        $this->book(['from' => $this->day(3), 'to' => $this->day(1)])->assertSessionHasErrors(['to' => 'badTo']);
        $this->book(['email' => 'a@b', 'phone' => '123'])
            ->assertSessionHasErrors(['email' => 'badEmail', 'phone' => 'badPhone']);
        $this->book(['name' => str_repeat('a', 81)])->assertSessionHasErrors(['name' => 'tooLong']);
        $this->post("/rents/{$this->golf->id}", [])->assertSessionHasErrors([
            'from' => 'required', 'to' => 'required', 'name' => 'required',
            'email' => 'required', 'phone' => 'required', 'address' => 'required',
        ]);

        $this->assertSame(4, Booking::count());
    }

    public function test_the_confirmation_is_only_shown_after_booking(): void
    {
        $this->get('/done')->assertRedirect('/main');
    }

    public function test_unknown_addresses_and_cars_show_the_not_found_page(): void
    {
        foreach (['/nincs-ilyen', '/rents/999', '/rents/abc'] as $url) {
            $this->get($url)->assertNotFound()->assertInertia(fn (Page $page) => $page->component('NotFound'));
        }
    }
}
