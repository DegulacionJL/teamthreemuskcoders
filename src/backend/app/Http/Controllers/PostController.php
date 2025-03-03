<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\Post;
use App\Services\API\PostService;
use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Requests\API\Users\PostRequest;

class PostController extends Controller
{
    protected $postService;
    

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;

        // enable api middleware
        $this->middleware(['auth:api']);
    }

    public function getPost()
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


    public function likePost(Request $request)
    {
        $this->response = ['code' => 200]; // Initialize response with default code

        try {
            $post_id = $request->input('post_id');
            $user_id = $request->input('user_id');
            $result = $this->postService->likePost($post_id, $user_id);
        } catch (Exception $e) { //@codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } //@codeCoverageIgnoreEnd

        return response()->json(new PostResource((object) ['result' => $result]));
    }

    public function commentPost(Request $request)
    {
        $this->response = ['code' => 200]; // Initialize response with default code

        try {
            $post_id = $request->input('post_id');
            $user_id = $request->input('user_id');
            $content = $request->input('content');
            $result = $this->postService->commentPost($post_id, $user_id, $content);
        } catch (Exception $e) { //@codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } //@codeCoverageIgnoreEnd

        return response()->json(new PostResource((object) ['result' => $result]));
    }


    public function update(PostRequest $request, $id)
    {
        try {
            $post = Post::findOrFail($id);
            $post->update($request->validated());
            return new PostResource($post);
        } catch (Exception $e) {
            return response()->json(['error' => 'Post not found or update failed'], 404);
        }
    }

    public function delete($id)
    {
        try {
            $post = Post::findOrFail($id);
            $post->delete();
            return response()->json(['message' => 'Post deleted successfully']);
        } catch (Exception $e) {
            return response()->json(['error' => 'Post not found or delete failed'], 404);
        }
    }
}