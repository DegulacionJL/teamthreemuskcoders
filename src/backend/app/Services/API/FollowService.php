<?php

namespace App\Services\API;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Models\Post;
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

    public function getSuggestedUsers($userId)
    {
        // Fetch users the authenticated user doesn't follow, sorted by engagement
        return User::query()
            ->where('id', '!=', $userId) // Exclude the authenticated user
            ->whereNotIn('id', function ($query) use ($userId) {
                $query->select('following_id')
                    ->from('follows')
                    ->where('follower_id', $userId);
            })
            ->withCount('posts') // Count posts for engagement
            ->orderByDesc('posts_count') // Sort by post count
            ->take(5) // Limit to 5 suggestions
            ->get();
    }

    public function getTrendingTags()
    {
        // Fetch recent posts (e.g., from the last 7 days)
        $posts = Post::where('created_at', '>=', now()->subDays(7))
            ->pluck('caption');

        // Extract hashtags from captions
        $hashtags = [];
        foreach ($posts as $caption) {
            preg_match_all('/#([\w]+)/', $caption, $matches);
            if (!empty($matches[1])) {
                $hashtags = array_merge($hashtags, $matches[1]);
            }
        }

        // Count hashtag frequency
        $hashtagCounts = array_count_values($hashtags);

        // Sort by frequency and take top 5
        arsort($hashtagCounts);
        $topHashtags = array_slice($hashtagCounts, 0, 5, true);

        // Map to desired format with random colors
        $colors = ['primary', 'secondary', 'success', 'warning', 'error'];
        $tags = [];
        $id = 1;
        foreach ($topHashtags as $hashtag => $count) {
            $tags[] = [
                'id' => $id++,
                'label' => '#' . $hashtag,
                'color' => $colors[array_rand($colors)],
            ];
        }

        return $tags;
    }
}
