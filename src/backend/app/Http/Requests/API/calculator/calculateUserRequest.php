<?php

namespace App\Http\Requests\API\Calculator;


use Illuminate\Foundation\Http\FormRequest;

class calculateUserRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'num1' => 'required|numeric',
            'num2' => 'required|numeric',
        ];
    }

}
