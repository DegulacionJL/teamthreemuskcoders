<?php

namespace App\Services\API;

use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class PostService
{

    protected $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function createMemePost(string $caption, $image, int $user_id)
    {
        if (!$user_id) {
            throw new Exception('User ID is missing');
        }

        try {
            // Create the post first
            $post = Post::create([
                'caption' => $caption,
                'user_id' => $user_id
            ]);

            // Handle image if provided
            if ($image) {
                $imagePath = env('STORAGE_DISK_URL').'/'.$image->store('images', 'public');

                Image::create([
                    'post_id' => $post->id,
                    'user_id' => $user_id,  
                    'image_path' => $imagePath
                ]);
            }

            return $post->load('image'); // Eager load image relationship
        } catch (\Exception $e) {
            throw new Exception("Error creating post: " . $e->getMessage());
        }
    }

    public function updatePost(Post $post, $caption)
    {
        if ($post->user_id !== Auth::id()){
            throw new Exception ("Unauthorized. You can only edit your own posts.");
        }
        $post->update(['caption' => $caption]);
        return $post->load('image');
    }

    public function updatePostImage(Post $post, $imageFile)
{
    $userId = auth()->id();
    if ($post->user_id !== $userId) {
        throw new Exception("Unauthorized. You can only edit your own posts.");
    }

    // Ensure $imageFile is a valid uploaded file
    if (!$imageFile || !$imageFile->isValid()) {
        return response()->json([
            'id' => $post->id,
            'caption' => $post->caption,
            'image' => [
                'image_path' => $imageFile->image_path . '?t=' . time(),
            ],
        ]);
    }

    // Check if post already has an associated image
    $image = $post->image ?? new Image([
        'post_id' => $post->id,
        'user_id' => $userId,
    ]);

    // Delete the old image if it exists
    if ($image->image_path) {
        Storage::disk('public')->delete(str_replace(env('STORAGE_DISK_URL') . '/', '', $image->image_path));
    }

    // Store the new image in 'storage/app/public/images'
    $imagePath = $imageFile->store('images', 'public');

    // Save the image path in the database (use full URL)
    $image->image_path = env('STORAGE_DISK_URL') . '/' . $imagePath;
    $image->save();

    return $post->load('image');
}

public function getPosts($page = 1)
    {
        $currentUser = Auth::user();
        
        // Fetch posts with pagination, including related user and image data
        $posts = Post::with('user', 'image')
            ->latest()
            ->paginate(10, ['*'], 'page', $page);
        
        // Get the post IDs for efficient querying
        $postIds = [];
        foreach ($posts->items() as $post) {
            $postIds[] = $post->id;
        }
        
        // If user is logged in, get their likes for these posts in a single query
        $userLikes = [];
        if ($currentUser) {
            $userLikesQuery = Like::where('user_id', $currentUser->id)
                ->whereIn('post_id', $postIds)
                ->get();
                
            foreach ($userLikesQuery as $like) {
                $userLikes[] = $like->post_id;
            }
        }
        
        // Get like counts for all posts in a single query (more efficient)
        $likeCounts = [];
        $likeCountsQuery = Like::whereIn('post_id', $postIds)
            ->selectRaw('post_id, count(*) as count')
            ->groupBy('post_id')
            ->get();
            
        foreach ($likeCountsQuery as $count) {
            $likeCounts[$count->post_id] = $count->count;
        }
        
        // Add reaction data to each post
        $postsWithReactions = $posts->items();
        foreach ($postsWithReactions as $post) {
            $post->reaction_data = [
                'has_liked' => in_array($post->id, $userLikes),
                'like_count' => isset($likeCounts[$post->id]) ? $likeCounts[$post->id] : 0
            ];
        }
        
        // Return data with pagination information
        return [
            'posts' => $postsWithReactions,
            'currentPage' => $posts->currentPage(),
            'lastPage' => $posts->lastPage(),
            'total' => $posts->total(),
            'currentUser' => $currentUser,
        ];
    }

    public function likePost($user, $postId)
    {
        $post = Post::findOrFail($postId);

        $existingLike = Like::where('user_id', $user->id)->where('post_id', $post->id)->first();

        if ($existingLike) {
            // Return the current like count even if already liked
            $likeCount = $post->likes()->count();
            
            return [
                'message' => 'You already liked this post.',
                'like_count' => $likeCount,
                'liked' => true
            ];
        }

        $like = new Like();
        $like->user_id = $user->id;
        $like->post_id = $post->id;
        $like->save();

        $likeCount = $post->likes()->count();

        return [
            'message' => 'Post liked successfully',
            'like_count' => $likeCount,
            'liked' => true
        ];
    }

    public function unlikePost($user, $postId)
    {
        $post = Post::findOrFail($postId);

        $like = Like::where('user_id', $user->id)->where('post_id', $post->id)->first();

        if (!$like){
            $likeCount = $post->likes()->count();

            return[
                'message' => 'You have not liked this post yet.',
                'like_count' => $likeCount,
                'liked' => false
            ];
        }

        $like->delete();

        $likeCount = $post->likes()->count();

        return [
            'message' => 'Post unliked successfully.',
            'like_count' => $likeCount,
            'liked'=>false
        ];

    }

    public function getLikes($postId)
    {
        try {
            $post = Post::findOrFail($postId);
            $currentUser = Auth::user();

            $likes = $post->likes()->with('user')->get();
            $likeCount = $post->likes()->count();

            // Initialize $userReaction as null
            $userReaction = null;
            $userHasLiked = false;

            // Check if the user has liked the post
            if ($currentUser) {
                $userLike = $likes->where('user_id', $currentUser->id)->first();
                if ($userLike) {
                    $userReaction = [
                        'id' => $userLike->id,
                        'created_at' => $userLike->created_at,
                        'user_id' => $currentUser->id
                    ];
                    $userHasLiked = true;
                }
            }

            return [
                'likes' => $likes,
                'like_count' => $likeCount,
                'user_has_liked' => $userHasLiked,
                'user_reaction' => $userReaction
            ];
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error in getLikes: ' . $e->getMessage());
            
            // Return a basic response to prevent frontend errors
            return [
                'likes' => [],
                'like_count' => 0,
                'user_has_liked' => false,
                'user_reaction' => null,
                'error' => 'Failed to fetch likes'
            ];
        }
    }
}