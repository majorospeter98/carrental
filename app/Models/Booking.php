<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/* The dates are not cast: "YYYY-MM-DD" strings compare correctly as text. */
#[Fillable(['car_id', 'name', 'email', 'phone', 'address', 'from_date', 'to_date', 'days', 'price', 'is_demo'])]
class Booking extends Model
{
    protected function casts(): array
    {
        return ['is_demo' => 'boolean'];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    /* Both ends are included, so sharing a single day is already a clash. */
    public function scopeOverlapping(Builder $query, string $from, string $to): void
    {
        $query->where('from_date', '<=', $to)->where('to_date', '>=', $from);
    }
}
