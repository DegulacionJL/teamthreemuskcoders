<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentRequest extends FormRequest
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
            'text' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'remove_image' => 'nullable|string',
            'parent_id' => 'nullable|exists:comments,id',
        ];
    }

    /**
     * Get the comment text.
     *
     * @return string
     */
    public function getText(): ?string
    {
        return $this->input('text');
    }

    /**
     * Get the image file.
     *
     * @return mixed
     */
    public function getImage()
    {
        return $this->file('image', null);
    }

    /**
     * Get the remove_image flag.
     *
     * @return bool|null
     */
    public function getRemoveImage()
    {
        return $this->input('remove_image') === 'true' ? true : null;
    }

    /**
     * Get the parent_id.
     *
     * @return int|null
     */
    public function getParentId()
    {
        return $this->input('parent_id');
    }
}