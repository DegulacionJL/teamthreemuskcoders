<?php

namespace App\Http\Requests\API\Users;

use Illuminate\Foundation\Http\FormRequest;


class PostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'caption' => 'sometimes|required|string|max:255',
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'user_id' => 'exists:users,id',
        ];
    }

    public function getCaption(): ?string
    {
        return $this->has('caption') ? $this->input('caption', null) : null;
    }

    public function getImage()
    {
        return $this->file('image', null); 
    }

    public function getUserId(): int
    {
        return (int) $this->input('user_id'); 
    }

}