<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    /* the browser has the same limits (utils/booking.ts) */
    private const MAX_AHEAD = 365;

    private const MAX_DAYS = 90;

    public function rules(): array
    {
        $from = $this->input('from');
        $lastPickup = today()->addDays(self::MAX_AHEAD)->toDateString();
        $lastReturn = is_string($from) && Carbon::hasFormat($from, 'Y-m-d')
            ? Carbon::parse($from)->addDays(self::MAX_DAYS - 1)->toDateString()
            : null;

        return [
            'from' => ['bail', 'required', 'date_format:Y-m-d', 'after_or_equal:today', "before_or_equal:{$lastPickup}"],
            'to' => [
                'bail', 'required', 'date_format:Y-m-d',
                Rule::when($this->filled('from'), 'after_or_equal:from'),
                Rule::when($lastReturn !== null, "before_or_equal:{$lastReturn}"),
            ],
            'name' => ['bail', 'required', 'string', 'max:80'],
            'email' => ['bail', 'required', 'string', 'max:120', 'regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/'],
            // at least 7 digits; spaces and "+" are allowed between them
            'phone' => ['bail', 'required', 'string', 'max:20', 'regex:/^[\s+]*(\d[\s+]*){7,}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'required',
            'string' => 'required',
            'max' => 'tooLong',
            'email.regex' => 'badEmail',
            'phone.regex' => 'badPhone',
            'from.date_format' => 'badFrom',
            'from.after_or_equal' => 'badFrom',
            'from.before_or_equal' => 'tooFarAhead',
            'to.date_format' => 'badTo',
            'to.after_or_equal' => 'badTo',
            'to.before_or_equal' => 'tooLongStay',
        ];
    }
}
