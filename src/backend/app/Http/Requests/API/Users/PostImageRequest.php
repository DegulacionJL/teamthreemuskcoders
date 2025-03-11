<?php
namespace App\Http\Requests\API\Users;

use Illuminate\Foundation\Http\FormRequest;

class PostImageRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'image' => 'nullable|string',
        ];
    }

    public function getImage()
    {
        return $this->file('image');
    }
}
