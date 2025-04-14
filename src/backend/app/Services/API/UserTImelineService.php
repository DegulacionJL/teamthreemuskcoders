<?php

namespace App\Services\API;

use Exception;
use App\Models\User;
use App\Models\Post;
use App\Models\Follow;
use App\Models\Image;
use App\Models\Profile;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserTimelineService
{
    /**
     * Get user profile with additional stats for timeline
     * 
     * @param int $userId
     * @return array
     */
    public function getUserProfile($userId)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Get or create profile
            $profile = $user->profile;
            if (!$profile) {
                $profile = $user->profile()->create();
            }
            
            // Load counts
            $postsCount = Post::where('user_id', $userId)->count();
            $followersCount = Follow::where('following_id', $userId)->count();
            $followingCount = Follow::where('follower_id', $userId)->count();
            
            // Combine user and profile data with counts
            $profileData = [
                'id' => $user->id,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'avatar' => $user->avatar ? env('STORAGE_DISK_URL') . '/' . $user->avatar : null,
                'coverPhoto' => $profile->cover_photo ? env('STORAGE_DISK_URL') . '/' . $profile->cover_photo : null,
                'bio' => $profile->bio,
                'work' => $profile->work,
                'education' => $profile->education,
                'location' => $profile->location,
                'birthday' => $profile->birthday,
                'website' => $profile->website,
                'relationship' => $profile->relationship,
                'postsCount' => $postsCount,
                'followersCount' => $followersCount,
                'followingCount' => $followingCount,
            ];
            
            return $profileData;
        } catch (Exception $e) {
            Log::error('Error in getUserProfile: ' . $e->getMessage());
            throw new Exception('Failed to fetch user profile: ' . $e->getMessage());
        }
    }
    
    /**
     * Get user posts for timeline
     * 
     * @param int $userId
     * @param int $page
     * @return array
     */
    public function getUserPosts($userId, $page = 1)
    {
        try {
            $user = User::findOrFail($userId);
            $currentUser = Auth::user();
            
            // Get posts with pagination
            $posts = Post::with('user', 'image')
                ->where('user_id', $userId)
                ->latest()
                ->paginate(10, ['*'], 'page', $page);
            
            // Get post IDs for efficient querying
            $postIds = [];
            foreach ($posts as $post) {
                $postIds[] = $post->id;
            }
            
            // Get like counts for all posts in a single query
            $likeCounts = [];
            $likesQuery = DB::table('likes')
                ->whereIn('post_id', $postIds)
                ->select('post_id', DB::raw('count(*) as count'))
                ->groupBy('post_id')
                ->get();
                
            foreach ($likesQuery as $like) {
                $likeCounts[$like->post_id] = $like->count;
            }
            
            // If user is logged in, get their likes for these posts
            $userLikes = [];
            if ($currentUser) {
                $userLikesQuery = DB::table('likes')
                    ->where('user_id', $currentUser->id)
                    ->whereIn('post_id', $postIds)
                    ->get();
                    
                foreach ($userLikesQuery as $like) {
                    $userLikes[] = $like->post_id;
                }
            }
            
            // Transform posts with reaction data
            $transformedPosts = [];
            foreach ($posts as $post) {
                $postArray = (new PostResource($post))->toArray(request());
                $postArray['reaction_data'] = [
                    'has_liked' => in_array($post->id, $userLikes),
                    'like_count' => isset($likeCounts[$post->id]) ? $likeCounts[$post->id] : 0
                ];
                $transformedPosts[] = $postArray;
            }
            
            return [
                'posts' => $transformedPosts,
                'currentPage' => $posts->currentPage(),
                'lastPage' => $posts->lastPage(),
                'total' => $posts->total(),
            ];
        } catch (Exception $e) {
            Log::error('Error in getUserPosts: ' . $e->getMessage());
            throw new Exception('Failed to fetch user posts: ' . $e->getMessage());
        }
    }
    
    /**
     * Update user profile
     * 
     * @param int $userId
     * @param array $data
     * @return array
     */
    public function updateUserProfile($userId, array $data)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Get or create profile
            $profile = $user->profile;
            if (!$profile) {
                $profile = $user->profile()->create();
            }
            
            // Update profile with validated data
            $profile->update($data);
            
            // Return updated profile data
            return $this->getUserProfile($userId);
        } catch (Exception $e) {
            Log::error('Error in updateUserProfile: ' . $e->getMessage());
            throw new Exception('Failed to update user profile: ' . $e->getMessage());
        }
    }
    
    /**
     * Upload user avatar
     * 
     * @param int $userId
     * @param $file
     * @return array
     */
    public function uploadUserAvatar($userId, $file)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            // Store new avatar
            $path = $file->store('avatars', 'public');
            $user->avatar = $path;
            $user->save();
            
            return [
                'avatar' => env('STORAGE_DISK_URL') . '/' . $path
            ];
        } catch (Exception $e) {
            Log::error('Error in uploadUserAvatar: ' . $e->getMessage());
            throw new Exception('Failed to upload avatar: ' . $e->getMessage());
        }
    }
    
    /**
     * Upload user cover photo
     * 
     * @param int $userId
     * @param $file
     * @return array
     */
    public function uploadCoverPhoto($userId, $file)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Get or create profile
            $profile = $user->profile;
            if (!$profile) {
                $profile = $user->profile()->create();
            }
            
            // Delete old cover photo if exists
            if ($profile->cover_photo) {
                Storage::disk('public')->delete($profile->cover_photo);
            }
            
            // Store new cover photo
            $path = $file->store('covers', 'public');
            $profile->cover_photo = $path;
            $profile->save();
            
            return [
                'coverPhoto' => env('STORAGE_DISK_URL') . '/' . $path
            ];
        } catch (Exception $e) {
            Log::error('Error in uploadCoverPhoto: ' . $e->getMessage());
            throw new Exception('Failed to upload cover photo: ' . $e->getMessage());
        }
    }
    
    /**
     * Get user friends/followers
     * 
     * @param int $userId
     * @return array
     */
    public function getUserFriends($userId)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Get followers
            $followersData = [];
            $followers = Follow::where('following_id', $userId)
                ->with('follower')
                ->get();
                
            foreach ($followers as $follow) {
                $follower = $follow->follower;
                $followersData[] = [
                    'id' => $follower->id,
                    'name' => trim($follower->first_name . ' ' . $follower->last_name),
                    'avatar' => $follower->avatar ? env('STORAGE_DISK_URL') . '/' . $follower->avatar : null,
                    'since' => $follow->created_at->format('Y-m-d')
                ];
            }
            
            // Get following
            $followingData = [];
            $following = Follow::where('follower_id', $userId)
                ->with('following')
                ->get();
                
            foreach ($following as $follow) {
                $followingUser = $follow->following;
                $followingData[] = [
                    'id' => $followingUser->id,
                    'name' => trim($followingUser->first_name . ' ' . $followingUser->last_name),
                    'avatar' => $followingUser->avatar ? env('STORAGE_DISK_URL') . '/' . $followingUser->avatar : null,
                    'since' => $follow->created_at->format('Y-m-d')
                ];
            }
            
            return [
                'followers' => $followersData,
                'following' => $followingData
            ];
        } catch (Exception $e) {
            Log::error('Error in getUserFriends: ' . $e->getMessage());
            throw new Exception('Failed to fetch user friends: ' . $e->getMessage());
        }
    }
    
    /**
     * Get user photos
     * 
     * @param int $userId
     * @return array
     */
    public function getUserPhotos($userId)
    {
        try {
            // Get all images from user's posts
            $postImagesData = [];
            $postImages = Image::whereHas('post', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->latest()
            ->get();
            
            foreach ($postImages as $image) {
                $postImagesData[] = [
                    'id' => $image->id,
                    'url' => $image->image_path,
                    'post_id' => $image->post_id,
                    'created_at' => $image->created_at->format('Y-m-d H:i:s')
                ];
            }
            
            return [
                'photos' => $postImagesData
            ];
        } catch (Exception $e) {
            Log::error('Error in getUserPhotos: ' . $e->getMessage());
            throw new Exception('Failed to fetch user photos: ' . $e->getMessage());
        }
    }
}