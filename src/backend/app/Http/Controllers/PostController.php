<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\Post;
use App\Services\API\PostService;
use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Requests\API\Users\PostRequest;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    protected $postService;
    

    public function __construct(PostService $postService)
{
    $this->response = ['code' => 200]; // Initialize response first
    $this->postService = $postService;
    $this->middleware(['auth:api']);
}
    public function create()
    {
        return Post::all();
    }

    public function createMemePost(PostRequest $request)
{
    $this->response = ['code' => 200]; // Initialize response with default code

    try {
        $request->validated();

        $caption = $request->input('caption');
        $image = $request->file('image');
        $user_id = auth()->id(); // Ensure the authenticated user ID is retrieved

        // Pass `user_id` explicitly
        $post = $this->postService->createMemePost($caption, $image, $user_id);

        $this->response['data'] = new PostResource($post);
    } catch (Exception $e) { 
        $this->response['error'] = $e->getMessage();
        $this->response['code'] = 500;
    }

    return response()->json($this->response, $this->response['code']);
}

public function index()
{
    return response()->json(Post::with('comments')->get());
}
    
}