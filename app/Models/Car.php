<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['brand', 'model', 'price_per_day', 'image'])]
class Car extends Model
{
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /* The seeded cars are the ones with a photo: the admin's form cannot set one. */
    public function isDefault(): bool
    {
        return $this->image !== '';
    }

    /**
     * What any visitor may see: booked periods only, never who booked them.
     */
    public function toPublic(): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'model' => $this->model,
            'pricePerDay' => $this->price_per_day,
            'image' => $this->image,
            'bookings' => $this->bookings
                ->where('to_date', '>=', today()->toDateString())
                ->map(fn (Booking $booking) => ['from' => $booking->from_date, 'to' => $booking->to_date])
                ->values()
                ->all(),
        ];
    }
}
