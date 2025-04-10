<?php

namespace App\Services\API;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class FollowService
{
    public function follow(User $user, $id)
    {
        try {
            // Don't allow following yourself
            if ($user->id == $id) {
                return 'Cannot follow yourself';
            }
            
            $userToFollow = User::findOrFail($id);
            
            // Check if already following
            if ($user->following()->where('following_id', $id)->exists()) {
                return 'Already following this user';
            }
            
            $user->following()->attach($userToFollow->id);
            
            Log::info("User {$user->id} successfully followed user {$id}");
            return 'Followed successfully';
        } catch (\Exception $e) {
            Log::error("Follow error: " . $e->getMessage());
            throw $e;
        }
    }

    public function unfollow(User $user, $id)
    {
        try {
            $userToUnfollow = User::findOrFail($id);
            
            // Check if actually following
            if (!$user->following()->where('following_id', $id)->exists()) {
                return 'Not following this user';
            }
            
            $user->following()->detach($userToUnfollow->id);
            
            Log::info("User {$user->id} successfully unfollowed user {$id}");
            return 'Unfollowed successfully';
        } catch (\Exception $e) {
            Log::error("Unfollow error: " . $e->getMessage());
            throw $e;
        }
    }

    public function isFollowing(User $user, $id)
    {
        try {
            return $user->following()->where('following_id', $id)->exists();
        } catch (\Exception $e) {
            Log::error("isFollowing error: " . $e->getMessage());
            throw $e;
        }
    }
}
