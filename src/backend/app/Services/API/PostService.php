<?php

namespace App\Services\API;

use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Exception;
use Illuminate\Support\Facades\DB;

class PostService
{
    protected $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function createMemePost(string $caption, $hashtag, $image, int $user_id)
    {
        Log::info('Postservice.create hashtag: '. $hashtag);
        if (!$user_id) {
            throw new Exception('User ID is missing');
        }

        try {
            // Create the post first
            $post = Post::create([
                'caption' => $caption,
                'hashtag' => $hashtag,
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

    public function getPostsByHashtag(string $hashtag, int $page = 1): LengthAwarePaginator
    {
        // Clean the hashtag (remove # if present)
        $cleanHashtag = ltrim($hashtag, '#');
        
        // Get posts with this hashtag using word boundaries for accurate matching
        return Post::where(function($query) use ($cleanHashtag) {
                // Match exact hashtag with word boundaries
                $query->where('caption', 'LIKE', '%#' . $cleanHashtag . ' %')
                      ->orWhere('caption', 'LIKE', '%#' . $cleanHashtag . '.%')
                      ->orWhere('caption', 'LIKE', '%#' . $cleanHashtag . ',%')
                      ->orWhere('caption', 'LIKE', '%#' . $cleanHashtag . ';%')
                      ->orWhere('caption', 'LIKE', '%#' . $cleanHashtag . '!%')
                      ->orWhere('caption', 'LIKE', '%#' . $cleanHashtag . '?%')
                      ->orWhere('caption', 'LIKE', '%#' . $cleanHashtag . "\n%")
                      // Also match hashtags at the end of text
                      ->orWhere('caption', 'LIKE', '%#' . $cleanHashtag);
            })
            ->with(['user', 'image', 'likes']) // Eager load relationships
            ->orderByDesc('created_at')
            ->paginate(10, ['*'], 'page', $page);
    }

    /**
     * Get trending hashtags
     * 
     * @param int $limit Number of trending hashtags to return
     * @return array
     */
    public function getTrendingMemes(int $limit = 10): array
    {
        $hashtags = Post::whereNotNull('caption')
            ->whereRaw("caption LIKE '%#%'")
            ->selectRaw("SUBSTRING_INDEX(SUBSTRING_INDEX(caption, '#', -1), ' ', 1) as hashtag")
            ->groupBy('hashtag')
            ->orderByRaw('COUNT(*) DESC')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return ['hashtag' => '#' . $item->hashtag];
            });
            
        return $hashtags->toArray();
    }

    /**
     * Get top meme post and user leaderboard for a given period
     *
     * @param string $period ('daily', 'weekly', 'monthly')
     * @return array
     */
    public function getTopMemeAndLeaderboard($period = 'daily')
    {
        try {
            // Determine the time range based on the period
            $startDate = now();
            $endDate = now();

            if ($period === 'daily') {
                $startDate = now()->startOfDay();
                $endDate = now()->endOfDay();
            } elseif ($period === 'weekly') {
                $startDate = now()->startOfWeek();
                $endDate = now()->endOfWeek();
            } elseif ($period === 'monthly') {
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
            } else {
                throw new Exception('Invalid period specified. Use "daily", "weekly", or "monthly".');
            }

            // Fetch the top post with the most likes for posts created in the period
            $topPost = Post::select('posts.id', 'posts.caption', 'posts.user_id')
                ->with(['user' => function ($query) {
                    $query->select('id', 'first_name', 'last_name', 'avatar');
                }, 'image'])
                ->leftJoin('likes', 'posts.id', '=', 'likes.post_id')
                ->whereBetween('posts.created_at', [$startDate, $endDate])
                ->groupBy('posts.id', 'posts.caption', 'posts.user_id')
                ->selectRaw('COUNT(likes.id) as laugh_votes')
                ->orderByDesc('laugh_votes')
                ->first();

            // Format the top post response
            $topPostResult = ($topPost && (int) $topPost->laugh_votes > 0) ? [
                'id' => $topPost->id,
                'caption' => $topPost->caption,
                'image' => $topPost->image ? asset('storage/images/' . basename($topPost->image->image_path)) : null,
                'author' => $topPost->user ? trim($topPost->user->first_name . ' ' . $topPost->user->last_name) : 'Unknown',
                'author_avatar' => $topPost->user && $topPost->user->avatar ? asset('storage/avatars/' . basename($topPost->user->avatar)) : null,
                'laugh_votes' => (int) $topPost->laugh_votes,
                'is_king' => true
            ] : null;

            // Fetch leaderboard (top 3 users by total likes on posts created in the period) - robust SQL version
            $leaderboard = DB::table('posts')
                ->join('users', 'posts.user_id', '=', 'users.id')
                ->leftJoin('likes', 'posts.id', '=', 'likes.post_id')
                ->whereBetween('posts.created_at', [$startDate, $endDate])
                ->groupBy('posts.user_id', 'users.first_name', 'users.last_name')
                ->select(
                    'posts.user_id as id',
                    DB::raw("CONCAT(users.first_name, ' ', users.last_name) as name"),
                    DB::raw('COUNT(likes.id) as points')
                )
                ->having('points', '>', 0)
                ->orderByDesc('points')
                ->limit(3)
                ->get()
                ->map(function ($item, $index) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'points' => (int) $item->points,
                        'rank' => $index + 1,
                    ];
                })
                ->toArray();

            // Log the query result for debugging
            Log::info("Top Meme and Leaderboard query for period {$period}: ", [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'topPost' => $topPostResult,
                'leaderboard' => $leaderboard,
            ]);

            return [
                'top_post' => $topPostResult,
                'leaderboard' => $leaderboard,
                'period' => $period,
            ];
        } catch (\Exception $e) {
            Log::error('Error in getTopMemeAndLeaderboard: ' . $e->getMessage());
            return [
                'top_post' => null,
                'leaderboard' => [],
                'period' => $period,
                'error' => 'Failed to fetch top meme and leaderboard'
            ];
        }
    }


}