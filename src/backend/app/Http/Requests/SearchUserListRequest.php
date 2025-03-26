<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchUserListRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'keyword' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'limit' => 'nullable|integer|min:1',
            'order' => 'nullable|in:asc,desc',
            'sort' => 'nullable|string'
        ];
    }

    public function getKeyword(): ?string
    {
        return $this->input('keyword', '');
    }

    public function getPage(): int
    {
        return (int) $this->input('page', 1); // page default to 1.
    }

    public function getLimit(): int
    {
        return (int) $this->input('limit', config('search.results_per_page')); // set via config
    }

    public function getOrder(): string
    {
        return $this->input('order', 'desc');
    }

    public function getSort(): string
    {
        return $this->input('sort', 'id');
    }
}
