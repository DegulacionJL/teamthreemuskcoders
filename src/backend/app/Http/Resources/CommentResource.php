<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'text' => $this->text,
             'image' => $this->image ? asset('storage/' . $this->image) . '?t=' . time() : null,
            'user' => $this->user ? [
                'id' => $this->user->id,
                // 'first_name' => $this->user->first_name,
                // 'last_name' => $this->user->last_name,
                'full_name' => $this->user->first_name . ' ' . $this->user->last_name,
                'avatar' => $this->user->avatar,
            ] : null,
            'post_id' => $this->post_id,
            'created_at' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'timestamp' => $this->created_at->diffForHumans(), // Add this for easier access in frontend
        ];
    }
}