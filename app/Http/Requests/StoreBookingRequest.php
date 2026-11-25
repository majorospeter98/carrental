<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'from' => ['bail', 'required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'to' => ['bail', 'required', 'date_format:Y-m-d', Rule::when($this->filled('from'), 'after_or_equal:from')],
            'name' => ['bail', 'required', 'string', 'max:80'],
            'email' => ['bail', 'required', 'string', 'max:120', 'regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/'],
            // at least 7 digits; spaces and "+" are allowed between them
            'phone' => ['bail', 'required', 'string', 'max:20', 'regex:/^[\s+]*(\d[\s+]*){7,}$/'],
            'address' => ['bail', 'required', 'string', 'max:160'],
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
            'to.date_format' => 'badTo',
            'to.after_or_equal' => 'badTo',
        ];
    }
}
