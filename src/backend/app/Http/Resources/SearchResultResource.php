<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SearchResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'type' => $this->type,
            'id' => $this->id,
            'name' => $this->name ?? null,
            'username' => $this->username ?? null,
            'avatar' => $this->avatar ?? null,
            'content' => $this->content ?? null,
            'author' => $this->author ?? null,
            'count' => $this->count ?? null,
        ];
    }
}