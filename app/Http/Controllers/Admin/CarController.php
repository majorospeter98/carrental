<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CarRequest;
use App\Models\Car;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Cars', [
            'cars' => Car::with('bookings')->orderBy('id')->get()
                ->map(fn (Car $car) => [...$car->toPublic(), 'deletable' => ! $car->isDefault()]),
        ]);
    }

    public function store(CarRequest $request): RedirectResponse
    {
        Car::create($request->attributesForCar());

        return to_route('admin.cars');
    }

    public function update(CarRequest $request, Car $car): RedirectResponse
    {
        $car->update($request->attributesForCar());

        return to_route('admin.cars');
    }

    /* The car's bookings go with it (cascade on the foreign key). */
    public function destroy(Car $car): RedirectResponse
    {
        abort_if($car->isDefault(), 403);

        $car->delete();

        return to_route('admin.cars');
    }
}
