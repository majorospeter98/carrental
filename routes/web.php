<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\EncryptHistoryMiddleware;

Route::redirect('/', '/main');
Route::get('/main', HomeController::class)->name('main');

Route::get('/rents/{car}', [BookingController::class, 'create'])->whereNumber('car')->name('rents.create');
Route::post('/rents/{car}', [BookingController::class, 'store'])->whereNumber('car')->middleware('throttle:20,1')->name('rents.store');
Route::get('/done', [BookingController::class, 'done'])->name('done');

Route::middleware('guest')->group(function () {
    Route::get('/admin', [Admin\SessionController::class, 'create'])->name('login');
    Route::post('/admin', [Admin\SessionController::class, 'store']);
});

Route::middleware(['auth', EncryptHistoryMiddleware::class])->group(function () {
    Route::post('/admin/logout', [Admin\SessionController::class, 'destroy'])->name('logout');
    Route::get('/admin/dashboard', [Admin\BookingController::class, 'index'])->name('admin.bookings');
    Route::delete('/admin/dashboard/bookings', [Admin\BookingController::class, 'clear'])->name('admin.bookings.clear');
    Route::delete('/admin/dashboard/bookings/{booking}', [Admin\BookingController::class, 'destroy'])->whereNumber('booking')->name('admin.bookings.destroy')
        // already deleted, in another tab perhaps: show the list as it now is
        ->missing(fn () => to_route('admin.bookings'));
    Route::get('/admin/dashboard/cars', [Admin\CarController::class, 'index'])->name('admin.cars');
    Route::post('/admin/dashboard/cars', [Admin\CarController::class, 'store'])->name('admin.cars.store');
    Route::put('/admin/dashboard/cars/{car}', [Admin\CarController::class, 'update'])->whereNumber('car')->name('admin.cars.update');
    Route::delete('/admin/dashboard/cars/{car}', [Admin\CarController::class, 'destroy'])->whereNumber('car')->name('admin.cars.destroy')
        ->missing(fn () => to_route('admin.cars'));
});
