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
            $comments = $this->commentService->getComments($postId);
            $this->response['data'] = CommentResource::collection($comments);
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
}