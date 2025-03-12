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
        return [
            'post_id' => 'required|exists:posts,id',
            'text' => 'required|string|max:500',
        ];
    }
}