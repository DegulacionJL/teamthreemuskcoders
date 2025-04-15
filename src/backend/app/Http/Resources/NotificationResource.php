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
        $content = $this->content;
    $senderName = $this->sender ? $this->sender->full_name : 'Someone';

    // Customize content based on type
    switch($this->type) {
        case 'comment_reply':
            $content = "{$senderName} replied to your comment";
            break;
        // Add other cases as needed
    }

        return [
            'id' => $this->id,
        'content' => $content,
        'sender_id' => $this->sender_id,
        'recipient' => $this->recipient->full_name,
        'data' => $this->notifiable,
        'type' => $this->type,
        'read_at' => $this->read_at,
        'created_at' => $this->created_at,
        'notifiable_id' => $this->notifiable_id,
        'notifiable_type' => $this->notifiable_type,
        ];
    }
}
