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





class PostController extends Controller
{
    protected $postService;
    

    public function __construct(PostService $postService)
{
    $this->response = ['code' => 200]; // Initialize response first
    $this->postService = $postService;
    $this->middleware(['auth:api']);
}
  
public function createMemePost(PostRequest $request): JsonResponse
{
    try {
        $request->validated();

        $caption = $request->input('caption');
        $image = $request->file('image');
        $user_id = auth()->id();

        $post = $this->postService->createMemePost($caption, $image, $user_id);

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
        $user = Auth::user();
        $response = $this->postService->likePost($user, $postId);

        return response()->json($response);

    }

    public function unlikePost(Request $request, $postId)
    {
        $user = Auth::user();
        $response = $this->postService->unlikePost($user, $postId);

        return response()->json($response);
    }

    public function getLikes(Request $request, $postId)
    {
        return $this->postService->getLikes($postId);
    }


}