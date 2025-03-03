<?php

namespace App\Http\Requests\API\Users;

use Illuminate\Foundation\Http\FormRequest;


class PostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'caption' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_id' => 'required|exists:users,id',
        ];
    }

    public function getCaption(): string
    {
        return $this->input('caption');
    }

}