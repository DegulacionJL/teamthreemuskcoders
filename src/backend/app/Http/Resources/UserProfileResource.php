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
        return [
            'id' => $this['id'],
            'firstName' => $this['firstName'],
            'lastName' => $this['lastName'],
            'avatar' => $this['avatar'],
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