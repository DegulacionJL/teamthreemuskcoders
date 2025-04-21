<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SuggestedUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'displayName' => $this->name, // Adjust if column is 'display_name'
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
        ];
    }
}