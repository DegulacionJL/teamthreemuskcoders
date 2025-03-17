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
    
    // Only require post_id for POST requests (new comments)
    if ($this->isMethod('post')) {
        $rules['post_id'] = 'required|exists:posts,id';
    }
    
    return $rules;
}
}