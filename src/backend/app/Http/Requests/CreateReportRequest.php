<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Set to true to allow all users, adjust this if you want to restrict it
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id', // Make sure user exists
            'reportable_id' => 'required|integer', // Ensure valid reportable ID
            'reportable_type' => 'required|string|in:App\\Models\\Post,App\\Models\\Comment', // Restrict to valid models
            'reason' => 'required|string|max:255', // The reason should not be too long
            'status' => 'required|string|in:pending,resolved', // The status must be valid
        ];
    }
}
