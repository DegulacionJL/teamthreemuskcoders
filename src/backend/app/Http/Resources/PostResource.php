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
            'like_count' => isset($this->reaction_data['like_count']) ? $this->reaction_data['like_count'] : (isset($this->likes_count) ? $this->likes_count : ($this->likes->count() ?? 0)),
            'user_has_liked' => isset($this->reaction_data['has_liked']) ? $this->reaction_data['has_liked'] : false,
            'user' => $this->user? [
                    'id' => $this->user->id,
                    'name' => trim($this->user->first_name. ' '.$this->user->last_name),
                    'first_name' => $this->user->first_name,
                    'last_name' => $this->user->last_name,
                    'avatar' => $this->user->avatar ?? null,
                     ]: null,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'reaction_data' => isset($this->reaction_data) ? $this->reaction_data : null,
        ];
    }
}