<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if the authenticated user is updating their own profile
        // The detailed authorization check is also in the controller
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'bio' => 'nullable|string|max:500',
            'work' => 'nullable|string|max:255',
            'education' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'birthday' => 'nullable|date',
            'website' => 'nullable|url|max:255',
            'relationship' => 'nullable|string|max:100',
        ];
    }
}