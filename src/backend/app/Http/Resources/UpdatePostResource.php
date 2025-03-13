<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UpdatePostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'caption' => $this->caption,
            'image' => $this->image ? [
                'id' => $this->image->id,
                'image_url' => asset('storage/' . $this->image->image_path),
                'post_id' => $this->image->post_id,
                'user_id' => $this->image->user_id,
                'created_at' => $this->image->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $this->image->updated_at->format('Y-m-d H:i:s'),
            ] : null,
            'user' => [
                    'id' => $this->user->id,
                    'name' => $this->user->name ?? 'Unknown User', 
                     ],
            'created_at' => $this->created_at->format('y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('y-m-d H:i:s'),
           
        ];
    }
}
