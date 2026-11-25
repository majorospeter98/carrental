<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /* Demo bookings are dated from the day of seeding, so availability has something to show. */
    public function run(): void
    {
        // published on purpose: the README and the login page show it
        User::updateOrCreate(['username' => 'admin'], ['password' => 'admin12345']);

        $golf = $this->car('Volkswagen', 'Golf', 12000, 'golf');
        $corolla = $this->car('Toyota', 'Corolla', 11000, 'toyota');
        $bmw = $this->car('BMW', '3 Series', 20000, 'bmw');

        $this->booking($corolla, 'Minta Anna', 2, 5);
        $this->booking($golf, 'Teszt Béla', 10, 13);
        $this->booking($corolla, 'Próba Dénes', 11, 16);
        $this->booking($bmw, 'Példa Csilla', 12, 18);
    }

    private function car(string $brand, string $model, int $price, string $photo): Car
    {
        return Car::create(['brand' => $brand, 'model' => $model, 'price_per_day' => $price, 'image' => "/images/{$photo}.jpg"]);
    }

    private function booking(Car $car, string $name, int $first, int $last): void
    {
        $days = $last - $first + 1;

        $car->bookings()->create([
            'name' => $name,
            'email' => 'demo@example.com',
            'phone' => '36301234567',
            'address' => 'Minta utca 1.',
            'from_date' => today()->addDays($first)->toDateString(),
            'to_date' => today()->addDays($last)->toDateString(),
            'days' => $days,
            'price' => $days * $car->price_per_day,
            'is_demo' => true,
        ]);
    }
}
