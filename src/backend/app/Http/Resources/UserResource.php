<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'status' => $this->status,
            'role' => count($this->roles) > 0 ? $this->roles[0]->name : null,
            'created_at' => $this->created_at,
        'last_login' => $this->last_login, // ✅ this line is critical
        ];
    }
}
