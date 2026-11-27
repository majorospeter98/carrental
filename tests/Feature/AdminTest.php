<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Page;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function admin(): User
    {
        return User::where('username', 'admin')->firstOrFail();
    }

    public function test_guests_cannot_reach_the_admin_pages(): void
    {
        $car = Car::first();
        $this->booked($car, 2, 5);

        $this->get('/admin/dashboard')->assertRedirect('/admin');
        $this->get('/admin/dashboard/cars')->assertRedirect('/admin');
        $this->delete('/admin/dashboard/bookings')->assertRedirect('/admin');
        $this->post('/admin/dashboard/cars', [])->assertRedirect('/admin');
        $this->put("/admin/dashboard/cars/{$car->id}", [])->assertRedirect('/admin');
        $this->assertSame(1, Booking::count());
    }

    public function test_the_demo_login_works_and_logs_out(): void
    {
        $this->post('/admin', ['username' => 'admin', 'password' => 'admin12345'])
            ->assertRedirect('/admin/dashboard');
        $this->assertAuthenticated();
        $this->get('/admin')->assertRedirect('/admin/dashboard');

        $this->post('/admin/logout')->assertRedirect('/admin');
        $this->assertGuest();
    }

    public function test_a_wrong_password_is_refused_and_guessing_is_limited(): void
    {
        $wrong = ['username' => 'admin', 'password' => 'nope'];

        for ($i = 0; $i < 5; $i++) {
            $this->post('/admin', $wrong)->assertSessionHasErrors(['login' => 'loginError']);
        }
        $this->post('/admin', $wrong)->assertSessionHasErrors(['login' => 'tooMany']);
        $this->assertGuest();
    }

    public function test_the_dashboard_lists_the_bookings_in_date_order(): void
    {
        // saved latest first, listed earliest first
        $this->booked(Car::where('model', 'Golf')->firstOrFail(), 10, 13, 'Teszt Béla');
        $this->booked(Car::where('model', 'Corolla')->firstOrFail(), 2, 5);

        $this->actingAs($this->admin())->get('/admin/dashboard')->assertInertia(fn (Page $page) => $page
            ->component('Dashboard')
            ->has('rents', 2)
            ->where('rents.0.name', 'Minta Anna')
            ->where('rents.0.car', 'Toyota Corolla'));
    }

    public function test_clearing_the_bookings_frees_the_cars(): void
    {
        $this->booked(Car::first(), 2, 5);

        $this->actingAs($this->admin())->delete('/admin/dashboard/bookings')->assertRedirect('/admin/dashboard');

        $this->assertSame(0, Booking::count());
        $this->get('/main')->assertInertia(fn (Page $page) => $page->where('cars.0.bookings', []));
    }

    public function test_one_booking_can_be_deleted_and_the_others_stay(): void
    {
        $this->booked(Car::first(), 2, 5);
        $this->booked(Car::first(), 10, 13, 'Teszt Béla');
        $first = Booking::orderBy('id')->firstOrFail();

        $this->delete("/admin/dashboard/bookings/{$first->id}")->assertRedirect('/admin');
        $this->assertSame(2, Booking::count());

        $this->actingAs($this->admin())->delete("/admin/dashboard/bookings/{$first->id}")->assertRedirect('/admin/dashboard');
        $this->assertSame(['Teszt Béla'], Booking::pluck('name')->all());
    }

    public function test_an_added_car_can_be_deleted_with_its_bookings(): void
    {
        $car = Car::create(['brand' => 'Skoda', 'model' => 'Octavia', 'price_per_day' => 9000, 'image' => '']);
        $this->booked($car, 2, 5);

        $this->delete("/admin/dashboard/cars/{$car->id}")->assertRedirect('/admin');
        $this->assertModelExists($car);

        $this->actingAs($this->admin())->delete("/admin/dashboard/cars/{$car->id}")->assertRedirect('/admin/dashboard/cars');
        $this->assertModelMissing($car);
        $this->assertSame(0, Booking::count());
    }

    public function test_deleting_what_is_already_gone_returns_to_the_list(): void
    {
        $this->delete('/admin/dashboard/bookings/999')->assertRedirect('/admin');

        $this->actingAs($this->admin());
        $this->delete('/admin/dashboard/bookings/999')->assertRedirect('/admin/dashboard');
        $this->delete('/admin/dashboard/cars/999')->assertRedirect('/admin/dashboard/cars');
    }

    public function test_the_default_cars_cannot_be_deleted(): void
    {
        $this->actingAs($this->admin());

        foreach (Car::all() as $car) {
            $this->delete("/admin/dashboard/cars/{$car->id}")->assertForbidden();
        }

        $this->assertSame(3, Car::count());
    }

    public function test_a_car_can_be_added_and_edited(): void
    {
        $this->actingAs($this->admin());

        $this->post('/admin/dashboard/cars', ['brand' => 'Skoda', 'model' => 'Octavia', 'pricePerDay' => '9000'])
            ->assertRedirect('/admin/dashboard/cars');
        $this->assertDatabaseHas('cars', ['brand' => 'Skoda', 'price_per_day' => 9000, 'image' => '']);

        $golf = Car::where('model', 'Golf')->firstOrFail();
        $this->booked($golf, 10, 13);
        $this->put("/admin/dashboard/cars/{$golf->id}", ['brand' => 'Volkswagen', 'model' => 'Golf', 'pricePerDay' => 13000])
            ->assertRedirect('/admin/dashboard/cars');
        $this->assertSame(13000, $golf->refresh()->price_per_day);
        $this->assertSame('/images/golf.jpg', $golf->image);
        $this->assertSame(1, $golf->bookings()->count());
    }

    public function test_a_car_needs_a_name_and_a_sensible_price(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/dashboard/cars', ['brand' => '', 'model' => str_repeat('a', 31), 'pricePerDay' => 10])
            ->assertSessionHasErrors(['brand' => 'required', 'model' => 'tooLong', 'pricePerDay' => 'badPrice']);

        $this->assertSame(3, Car::count());
    }

    public function test_empty_login_fields_are_named_and_not_counted(): void
    {
        for ($i = 0; $i < 6; $i++) {
            $this->post('/admin', [])->assertSessionHasErrors(['username' => 'required', 'password' => 'required']);
        }

        $this->post('/admin', ['username' => 'admin', 'password' => 'admin12345'])->assertRedirect('/admin/dashboard');
    }

    public function test_a_configured_header_gives_each_visitor_their_own_login_limit(): void
    {
        config(['app.client_ip_header' => 'CF-Connecting-IP']);
        $wrong = ['username' => 'admin', 'password' => 'nope'];

        for ($i = 0; $i < 5; $i++) {
            $this->post('/admin', $wrong, ['CF-Connecting-IP' => '203.0.113.10']);
        }

        $this->post('/admin', $wrong, ['CF-Connecting-IP' => '203.0.113.10'])->assertSessionHasErrors(['login' => 'tooMany']);
        $this->post('/admin', $wrong, ['CF-Connecting-IP' => '198.51.100.20'])->assertSessionHasErrors(['login' => 'loginError']);
    }
}
