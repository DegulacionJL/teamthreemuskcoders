<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
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
            'caption' => $this->caption,
            'image' => $this->image ? asset('storage/images/' . basename($this->image->image_path)) : null,
            'user' => [
                    'id' => $this->user->id,
                    'name' => $this->user->name ?? 'Unknown User', 
                     ],
            'created_at' => $this->created_at->format('y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('y-m-d H:i:s'),
           
        ];
    }
}