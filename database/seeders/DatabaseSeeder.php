<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /* The admin and the fleet. Bookings are made in the app. */
    public function run(): void
    {
        // published on purpose: the README and the login page show it
        User::updateOrCreate(['username' => 'admin'], ['password' => 'admin12345']);

        $this->car('Volkswagen', 'Golf', 12000, 'golf');
        $this->car('Toyota', 'Corolla', 11000, 'toyota');
        $this->car('BMW', '3 Series', 20000, 'bmw');
    }

    private function car(string $brand, string $model, int $price, string $photo): void
    {
        Car::create(['brand' => $brand, 'model' => $model, 'price_per_day' => $price, 'image' => "/images/{$photo}.jpg"]);
    }
}
