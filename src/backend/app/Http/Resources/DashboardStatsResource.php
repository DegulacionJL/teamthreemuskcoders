<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
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
            'total_users' => $this['total_users'],
            'new_users' => $this['new_users'],
            'total_memes' => $this['total_memes'],
            'reported_memes' => $this['reported_memes'],
            'active_users' => $this['active_users'],
            'banned_users' => $this['banned_users'],
            'reported_comments' => $this['reported_comments'],
            'active_users_today' => $this['active_users_today'],
            'new_memes_today' => $this['new_memes_today'],
            'reported_content_today' => $this['reported_content_today'],
        ];
    }
}