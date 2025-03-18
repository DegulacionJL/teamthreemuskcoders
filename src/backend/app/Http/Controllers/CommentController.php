<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Services\API\CommentService;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function index($postId)
    {
        $comments = $this->commentService->getComments($postId);
        return CommentResource::collection($comments);
    }

    public function store(CommentRequest $request, $postId)
{
    // Merge the postId from the URL into the validated data
    $data = array_merge($request->validated(), ['post_id' => $postId]);
    
    if ($request->hasFile('image_url')) {
        $data['image_url'] = $request->file('image_url');
    }

    $comment = $this->commentService->addComment($data);
    return new CommentResource($comment);
}

public function update(CommentRequest $request, $postId, $commentId): JsonResponse
{
    try {
        $data = array_merge($request->validated(), ['post_id' => $postId]);

        if ($request->hasFile('image_url')) {
            $data['image_url'] = $request->file('image_url')->store('comments-images', 'public');
        }

        $updatedComment = $this->commentService->updateComment($commentId, $postId, $data);
        return response()->json(new CommentResource($updatedComment), 200);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function destroy($postId, $commentId): JsonResponse
    {
        try {
            $this->commentService->deleteComment($commentId, $postId);
            return response()->json(['message' => 'Comment deleted successfully.'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}