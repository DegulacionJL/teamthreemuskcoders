<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class SearchRequestUsers extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'keyword' => 'required|string|max:255',
            'types' => 'required|array',
            'types.*' => 'in:user,post,hashtag',
            'limit' => 'integer|min:1|max:100',
            'page' => 'integer|min:1',
        ];
    }
}