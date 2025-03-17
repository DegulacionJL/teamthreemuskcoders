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
        'user' => $this->user ? [
            'id' => $this->user->id,
            'name' => $this->user->name,
        ] : null,
        'post_id' => $this->post_id,
        'created_at' => $this->created_at->diffForHumans(),
        'updated_at' => $this->updated_at->toDateTimeString(),
    ];
    }
}