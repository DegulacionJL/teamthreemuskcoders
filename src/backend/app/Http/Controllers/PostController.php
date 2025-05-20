<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\Post;
use App\Services\API\PostService;
use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\UpdatePostResource;
use App\Http\Requests\API\Users\PostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Requests\UpdateImagePostRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\HashtagPostRequest;
use App\Http\Resources\HashtagResource;

class PostController extends Controller
{
    protected $postService;
    
    public function __construct(PostService $postService)
    {
        $this->response = ['code' => 200]; // Initialize response first
        $this->postService = $postService;
        $this->middleware('auth:api')->except(['index']);
    }
  
    public function createMemePost(PostRequest $request): JsonResponse
    {
        try {
            $request->validated();
            
            $caption = $request->input('caption');
            // $hashtag = json_encode($request->input('hashtag'));
            $hashtag = $request->input('hashtag');
            $image = $request->file('image');
            $user_id = auth()->id();

            $post = $this->postService->createMemePost($caption, $hashtag, $image, $user_id);

            return response()->json(['data' => new PostResource($post)], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updatePost(UpdatePostRequest $request, Post $post): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Add explicit authorization check
        if ($post->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized. You can only edit your own posts.'], 403);
        }

        $this->response = ['code' => 200];

        try {
            $validatedData = $request->validated();
            $updatedPost = $this->postService->updatePost($post, $validatedData['caption']);

            $this->response['data'] = new UpdatePostResource($updatedPost->load('image'));
        } catch (Exception $e) {
            $this->response['error'] = $e->getMessage(); 
            $this->response['code'] = 500;
        }
   
        return response()->json($this->response, $this->response['code']);
    }

    public function updatePostImage(UpdateImagePostRequest $request, Post $post): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Add explicit authorization check
        if ($post->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized. You can only edit your own posts.'], 403);
        }

        $this->response = ['code' => 200];

        try {
            $imageFile = $request->file('image');
            $updatedPost = $this->postService->updatePostImage($post, $imageFile);

            $this->response['data'] = new UpdatePostResource($updatedPost->load('image'));
        } catch (Exception $e) {
            $this->response['error'] = $e->getMessage();
            $this->response['code'] = 500;
        }

        return response()->json($this->response, $this->response['code']);
    }

    public function index(PostRequest $request)
    {
        // Fetch the posts through the service
        $data = $this->postService->getPosts($request->page());

        // Return the response
        return response()->json($data);
    }

    public function deletePost($id)
    {
        $post = Post::findOrFail($id);
    
        // Check if the post has an image
        if ($post->image) {
            // Extract the image path
            $imagePath = str_replace('/storage/', 'public/', $post->image->image_path);
    
            // Delete the image file from storage
            if (Storage::exists($imagePath)) {
                Storage::delete($imagePath);
            }
    
            // Also delete the related image record from the database
            $post->image()->delete();
        }
    
        // Delete the post itself
        $post->delete();
    
        return response()->json(['message' => 'Post and image deleted successfully']);
    }

    public function likePost(Request $request, $postId)
    {
        try {
            $user = Auth::user();
            $result = $this->postService->likePost($user, $postId);
            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to like post',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function unlikePost(Request $request, $postId)
    {
        try {
            $user = Auth::user();
            $result = $this->postService->unlikePost($user, $postId);
            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to unlike post',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getLikes(Request $request, $postId)
    {
        try {
            $result = $this->postService->getLikes($postId);
            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch likes',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getTrendingMemes()
    {
        try {
            // Ensure user is authenticated (even though middleware should handle this)
            if (!auth()->check()) {
                return response()->json([
                    'error' => 'User not authenticated',
                    'code' => 401
                ], 401);
            }
            
            // Fetch the latest 5-8 hashtags from posts
           
            $hashtags = Post::select('id', 'caption')
    ->whereNotNull('caption')
    ->orderBy('created_at', 'desc')
    ->limit(20)
    ->get()
    ->flatMap(function ($post) {
        // Extract hashtags using a regex that matches hashtags followed by word boundaries
        preg_match_all('/#\w+/', $post->caption, $matches);

        return collect($matches[0])->map(function ($hashtag) use ($post) {
            return [
                'hashtag' => $hashtag,
                'post_id' => $post->id,
            ];
        });
    })
    ->unique('hashtag')
    ->take(8)
    ->values();
                // Note: The above code assumes that the hashtags are stored in a way that they can be decoded or split.                
            /*
             $hashtags = Post::select('id', 'hashtag')
                ->whereNotNull('hashtag')
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get()
                ->flatMap(function ($post) {
                    $tags = is_array($post->hashtag) ? $post->hashtag : json_decode($post->hashtag, true);
                    return collect($tags ?: [])->map(function ($hashtag) use ($post) {
                        return [
                            'hashtag' => $hashtag,
                            'post_id' => $post->id,
                        ];
                    });
                })
                ->unique('hashtag')
                ->take(8)
                ->values();
             */

            return response()->json([
                'data' => $hashtags,
                'code' => 200
            ], 200);
            
        } catch (Exception $e) {
            // Log the exception for debugging
            Log::error('Error in getTrendingMemes: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Failed to fetch trending memes: ' . $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }
    public function getPostsByHashtag(HashtagPostRequest $request, $hashtag): JsonResponse
{
    try {
        // Handle empty or undefined hashtags
        if ($hashtag === 'undefined' || empty($hashtag)) {
            return $this->emptyResponse();
        }

        // Clean the hashtag by removing the leading '#' for matching
        $cleanHashtag = ltrim($hashtag, '#');

        // Query posts that contain the hashtag using a REGEXP match and eager-load the image relationship
        $posts = Post::with('image') 
            ->where('caption', 'REGEXP', '(^|[^a-zA-Z0-9_])#' . preg_quote($cleanHashtag) . '($|[^a-zA-Z0-9_])')
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'page', $request->page ?? 1);

        return response()->json([
            'posts' => HashtagResource::collection($posts),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ]
        ]);
    } catch (\Exception $e) {
        // Log the error for debugging
        Log::error('Error fetching posts by hashtag: ' . $e->getMessage());

        // Return a friendly error response
        return response()->json([
            'error' => 'Failed to fetch posts by hashtag',
            'posts' => [],
            'meta' => [
                'current_page' => 1,
                'last_page' => 1,
                'total' => 0,
            ]
        ], 500);
    }
}

    /**
     * Return empty response with proper structure
     * 
     * @return JsonResponse
     */
    private function emptyResponse(): JsonResponse
    {
        return response()->json([
            'posts' => [],
            'meta' => [
                'current_page' => 1,
                'last_page' => 1,
                'total' => 0,
            ]
        ]);
    }
    

    /**
     * Get top meme post and user leaderboard
     */
    public function getTopMemeAndLeaderboard(Request $request): JsonResponse
    {
        try {
            $period = $request->query('period', 'daily'); // Default to 'daily'
            $result = $this->postService->getTopMemeAndLeaderboard($period);
            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch top meme and leaderboard',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Batch endpoint: Get top meme and leaderboard for all periods
     */
    public function getAllTopMemesAndLeaderboards(Request $request)
    {
        try {
            $periods = ['daily', 'weekly', 'monthly'];
            $result = [];
            foreach ($periods as $period) {
                // Use the service directly to avoid double response wrapping
                $result[$period] = $this->postService->getTopMemeAndLeaderboard($period);
            }
            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch all top memes and leaderboards',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}