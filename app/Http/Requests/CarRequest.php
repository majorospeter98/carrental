<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CarRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'brand' => ['bail', 'required', 'string', 'max:30'],
            'model' => ['bail', 'required', 'string', 'max:30'],
            'pricePerDay' => ['bail', 'required', 'integer', 'between:1000,50000'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'required',
            'string' => 'required',
            'max' => 'tooLong',
            'pricePerDay.required' => 'badPrice',
            'pricePerDay.integer' => 'badPrice',
            'pricePerDay.between' => 'badPrice',
        ];
    }

    /** The validated input under the database's column names. */
    public function attributesForCar(): array
    {
        $data = $this->validated();

        return ['brand' => $data['brand'], 'model' => $data['model'], 'price_per_day' => (int) $data['pricePerDay']];
    }
}
