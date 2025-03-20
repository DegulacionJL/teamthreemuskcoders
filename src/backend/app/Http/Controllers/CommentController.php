<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Services\API\CommentService;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

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
    // Get validated data
    $data = $request->validated();
    
    // Add the post_id
    $data['post_id'] = $postId;
    
    // Handle file upload separately
    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image');
    }

    $comment = $this->commentService->addComment($data);
    return new CommentResource($comment);
}

public function update(CommentRequest $request, $postId, $commentId): JsonResponse
    {
        try {
            // The request is already validated by CommentRequest
            $data = $request->validated();

            // Add the post_id
            $data['post_id'] = $postId;

            // Handle file upload separately
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image');
            }

            // Handle the remove_image flag
            if ($request->has('remove_image') && $request->remove_image === 'true') {
                $data['remove_image'] = true;
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