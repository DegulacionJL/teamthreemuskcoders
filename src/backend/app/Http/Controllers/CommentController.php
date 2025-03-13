<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Services\API\CommentService;
use Illuminate\Http\JsonResponse;

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

    public function store(CommentRequest $request)
    {
        $comment = $this->commentService->addComment($request->validated());
        return new CommentResource($comment);
    }

    public function destroy($postId, $commentId): JsonResponse
    {
        $this->commentService->deleteComment($commentId, $postId);
        return response()->json(['message' => 'Comment deleted successfully.'], 200);
    }
}