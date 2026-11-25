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

        $this->get('/admin/dashboard')->assertRedirect('/admin');
        $this->get('/admin/dashboard/cars')->assertRedirect('/admin');
        $this->delete('/admin/dashboard/bookings')->assertRedirect('/admin');
        $this->post('/admin/dashboard/cars', [])->assertRedirect('/admin');
        $this->put("/admin/dashboard/cars/{$car->id}", [])->assertRedirect('/admin');
        $this->assertSame(4, Booking::count());
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
        $this->actingAs($this->admin())->get('/admin/dashboard')->assertInertia(fn (Page $page) => $page
            ->component('Dashboard')
            ->has('rents', 4)
            ->where('rents.0.name', 'Minta Anna')
            ->where('rents.0.car', 'Toyota Corolla'));
    }

    public function test_clearing_the_bookings_frees_the_cars(): void
    {
        $this->actingAs($this->admin())->delete('/admin/dashboard/bookings')->assertRedirect('/admin/dashboard');

        $this->assertSame(0, Booking::count());
        $this->get('/main')->assertInertia(fn (Page $page) => $page->where('cars.0.bookings', []));
    }

    public function test_a_car_can_be_added_and_edited(): void
    {
        $this->actingAs($this->admin());

        $this->post('/admin/dashboard/cars', ['brand' => 'Skoda', 'model' => 'Octavia', 'pricePerDay' => '9000'])
            ->assertRedirect('/admin/dashboard/cars');
        $this->assertDatabaseHas('cars', ['brand' => 'Skoda', 'price_per_day' => 9000, 'image' => '']);

        $golf = Car::where('model', 'Golf')->firstOrFail();
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
}
