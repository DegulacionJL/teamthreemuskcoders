<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class AdminDashboardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = $this->user();
        
        // Log user information for debugging
        if ($user) {
            Log::info('User attempting to access admin dashboard', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name'),
            ]);
        } else {
            Log::warning('No authenticated user found when accessing admin dashboard');
        }
        
        // Option 1: Check for specific admin role
        if ($user && $user->hasRole('admin')) {
            return true;
        }
        
        // Option 2: Check for any admin-like role
        if ($user && ($user->hasRole(['admin', 'administrator', 'super-admin']) || 
                      $user->hasPermissionTo('view dashboard'))) {
            return true;
        }
        
        // For development/testing purposes, you can temporarily return true
        // to bypass role checking (remove in production)
        // return true;
        
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [];
    }
    
    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [];
    }
    
    /**
     * Handle a failed authorization attempt.
     *
     * @return void
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    protected function failedAuthorization()
    {
        throw new \Illuminate\Auth\Access\AuthorizationException('You do not have permission to access the admin dashboard. Required role: admin');
    }
}