<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Base URL for storage
        $baseUrl = config('app.url') . '/api/storage/';

        // Sanitize avatar URL to remove duplicate base URL
        $avatar = $this['avatar'];
        if ($avatar) {
            // Remove any occurrence of the base URL prefix to avoid duplication
            $avatar = str_replace($baseUrl, '', $avatar);
            // Prepend the correct base URL
            $avatar = $baseUrl . ltrim($avatar, '/');
        }

        return [
            'id' => $this['id'],
            'firstName' => $this['firstName'],
            'lastName' => $this['lastName'],
            'avatar' => $avatar,
            'coverPhoto' => $this['coverPhoto'],
            'bio' => $this['bio'],
            'work' => $this['work'],
            'education' => $this['education'],
            'location' => $this['location'],
            'birthday' => $this['birthday'] ? date('Y-m-d', strtotime($this['birthday'])) : null,
            'website' => $this['website'],
            'relationship' => $this['relationship'],
            'postsCount' => $this['postsCount'],
            'followersCount' => $this['followersCount'],
            'followingCount' => $this['followingCount'],
        ];
    }
}