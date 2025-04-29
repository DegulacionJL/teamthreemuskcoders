<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HashtagResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'caption' => $this->caption,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Include user data
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'first_name' => $this->user->first_name,
                    'avatar' => $this->user->avatar,
                ];
            }),
            
            // Include image data
            'image' => $this->whenLoaded('image', function () {
                return [
                    'id' => $this->image->id,
                    'image_path' => $this->image->image_path,
                ];
            }),
            
            // Include reaction/likes data
            'reaction_data' => [
                'has_liked' => $this->when(isset($this->user_has_liked), $this->user_has_liked),
                'like_count' => $this->whenLoaded('likes', function () {
                    return $this->likes->count();
                }, 0),
            ],
            
            // Add any hashtags from the caption
            'hashtags' => $this->getHashtagsFromCaption(),
        ];
    }
    
    /**
     * Extract hashtags from post caption
     * 
     * @return array
     */
    private function getHashtagsFromCaption()
    {
        $hashtags = [];
        
        if ($this->caption) {
            preg_match_all('/#([a-zA-Z0-9_]+)/', $this->caption, $matches);
            if (isset($matches[1]) && !empty($matches[1])) {
                $hashtags = array_map(function($tag) {
                    return '#' . $tag;
                }, $matches[1]);
            }
        }
        
        return $hashtags;
    }
}
