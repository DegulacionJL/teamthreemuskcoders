<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Change this based on your auth logic
    }

    public function rules()
    {
        // Base rules
        $rules = [
            'text' => 'required|string|max:500',
        ];
        
        // No need to require post_id as it comes from the URL parameter
        
        return $rules;
    }
}