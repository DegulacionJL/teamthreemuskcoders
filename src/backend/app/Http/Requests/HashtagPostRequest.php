<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HashtagPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Since you're using auth middleware in routes, we can return true here
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
            'page' => 'sometimes|integer|min:1',
        ];
    }
    
    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // Ensure page parameter is set and is an integer
        if ($this->has('page')) {
            $this->merge([
                'page' => (int) $this->page
            ]);
        }
    }
}