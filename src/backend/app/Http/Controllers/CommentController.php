<?php

namespace App\Http\Controllers;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Services\API\CommentService;
use Illuminate\Http\JsonResponse;

/**
 * @group Comment Management
 */
class CommentController extends Controller
{
    /** @var App\Services\API\CommentService */
    protected $commentService;

    /**
     * CommentController constructor.
     *
     * @param App\Services\API\CommentService $commentService
     */
    public function __construct(CommentService $commentService)
    {
        parent::__construct();
        $this->commentService = $commentService;
    }

    /**
     * List Comments
     *
     * Retrieves all comments for a specific post.
     *
     * @param int $postId
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index($postId)
    {
        try {
            $perPage = request()->query('per_page', 5);
            $page = request()->query('page', 1);
            $parentId = request()->query('parent_id');

            if ($parentId) {
                $result = $this->commentService->getReplies($postId, $parentId, $perPage, $page);
            } else {
                $result = $this->commentService->getComments($postId, $perPage, $page);
            }

            $comments = $result['comments'];
            $totalWithReplies = $result['total_with_replies'];

            $this->response['data'] = CommentResource::collection($comments);
            $this->response['pagination'] = [
                'total' => $comments->total(),
                'total_with_replies' => $totalWithReplies,
                'per_page' => $comments->perPage(),
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'has_more' => $comments->hasMorePages(),
            ];
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Create Comment
     *
     * Creates a new comment for a specific post.
     *
     * @authenticated
     * @param App\Http\Requests\API\CommentRequest $request
     * @param int $postId
     * @return JsonResponse
     */
    public function store(CommentRequest $request, $postId)
    {
        $request->validated();

        try {
            $data = [
                'text' => $request->getText(),
                'post_id' => $postId,
                'image' => $request->getImage(),
                'parent_id' => $request->getParentId(),
            ];

            $comment = $this->commentService->addComment($data);
            $this->response['data'] = new CommentResource($comment);
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Update Comment
     *
     * Updates an existing comment.
     *
     * @authenticated
     * @param App\Http\Requests\API\CommentRequest $request
     * @param int $postId
     * @param int $commentId
     * @return JsonResponse
     */
    public function update(CommentRequest $request, $postId, $commentId): JsonResponse
    {
        $request->validated();

        try {
            $data = [
                'text' => $request->getText(),
                'post_id' => $postId,
                'image' => $request->getImage(),
                'remove_image' => $request->getRemoveImage(),
            ];

            $updatedComment = $this->commentService->updateComment($commentId, $postId, $data);
            $this->response['data'] = new CommentResource($updatedComment);
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Delete Comment
     *
     * Deletes a comment.
     *
     * @authenticated
     * @param int $postId
     * @param int $commentId
     * @return JsonResponse
     */
    public function destroy($postId, $commentId): JsonResponse
    {
        try {
            $this->commentService->deleteComment($commentId, $postId);
            $this->response['message'] = 'Comment deleted successfully.';
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }

        return response()->json($this->response, $this->response['code']);
    }

    public function likeComment($commentId): JsonResponse
{
    try {
        $result = $this->commentService->likeComment($commentId);
        $this->response['data'] = [
            'like_count' => $result['like_count'],
            'user_has_liked' => true
        ];
    } catch (Exception $e) {
        $this->response = [
            'error' => $e->getMessage(),
            'code' => 500,
        ];
    }

    return response()->json($this->response, $this->response['code']);
}

public function unlikeComment($commentId): JsonResponse
{
    try {
        $result = $this->commentService->unlikeComment($commentId);
        $this->response['data'] = [
            'like_count' => $result['like_count'],
            'user_has_liked' => false
        ];
    } catch (Exception $e) {
        $this->response = [
            'error' => $e->getMessage(),
            'code' => 500,
        ];
    }

    return response()->json($this->response, $this->response['code']);
}

public function getCommentLikes($commentId): JsonResponse
{
    try {
        $result = $this->commentService->getCommentLikes($commentId);
        $this->response['data'] = [
            'like_count' => $result['like_count'],
            'user_has_liked' => $result['user_has_liked']
        ];
    } catch (Exception $e) {
        $this->response = [
            'error' => $e->getMessage(),
            'code' => 500,
        ];
    }

    return response()->json($this->response, $this->response['code']);
}
}