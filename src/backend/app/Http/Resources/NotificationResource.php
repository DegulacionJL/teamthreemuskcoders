<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content, // Content is pre-formatted in CommentService.php
            'sender' => $this->sender ? [
                'id' => $this->sender->id,
                'full_name' => $this->sender->first_name . ' ' . $this->sender->last_name,
                'avatar' => $this->sender->avatar,
            ] : null,
            'recipient' => $this->recipient ? $this->recipient->first_name . ' ' . $this->recipient->last_name : null,
            'data' => $this->notifiable,
            'type' => $this->type,
            'read_at' => $this->read_at ? $this->read_at->toDateTimeString() : null,
            'created_at' => $this->created_at->toDateTimeString(),
            'notifiable_id' => $this->notifiable_id,
            'notifiable_type' => $this->notifiable_type,
        ];
    }
}