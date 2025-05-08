<?php

namespace App\Http\Controllers;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Services\API\CommentService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\ReportRequest;
use Illuminate\Support\Facades\DB;

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

            $result = $this->commentService->getComments($postId, $perPage, $page);

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
     * Get Paginated Replies
     *
     * Retrieves paginated replies for a specific comment.
     *
     * @param int $postId
     * @param int $commentId
     * @return JsonResponse
     */
    public function getReplies($postId, $commentId)
    {
        try {
            $perPage = request()->query('per_page', 3);
            $page = request()->query('page', 1);

            $result = $this->commentService->getReplies($commentId, $postId, $perPage, $page);

            $replies = $result['replies'];
            $totalReplies = $result['total_replies'];

            $this->response['data'] = CommentResource::collection($replies);
            $this->response['pagination'] = [
                'total' => $replies->total(),
                'total_replies' => $totalReplies,
                'per_page' => $replies->perPage(),
                'current_page' => $replies->currentPage(),
                'last_page' => $replies->lastPage(),
                'has_more' => $replies->hasMorePages(),
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

    /**
     * Report Comment
     *
     * Reports a comment with a reason.
     *
     * @authenticated
     * @param App\Http\Requests\ReportRequest $request
     * @param int $postId
     * @param int $commentId
     * @return JsonResponse
     */
    public function report(ReportRequest $request, $postId, $commentId): JsonResponse
    {
        $request->validated();

        try {
            $data = [
                'reason' => $request->input('reason'),
                'post_id' => $postId,
                'comment_id' => $commentId,
            ];

            $report = $this->commentService->reportComment($data);
            $this->response['message'] = 'Comment reported successfully.';
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }
        
        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Like a Comment
     *
     * Likes a specific comment.
     *
     * @authenticated
     * @param int $comment
     * @return JsonResponse
     */
    public function likeComment($comment): JsonResponse
    {
        try {
            $data = $this->commentService->likeComment($comment);
            $this->response['data'] = [
                'like_count' => $data['like_count'],
                'user_has_liked' => true,
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
     * Unlike a Comment
     *
     * Removes a like from a specific comment.
     *
     * @authenticated
     * @param int $comment
     * @return JsonResponse
     */
    public function unlikeComment($comment): JsonResponse
    {
        try {
            $data = $this->commentService->unlikeComment($comment);
            $this->response['data'] = [
                'like_count' => $data['like_count'],
                'user_has_liked' => false,
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
     * Get Comment Likes
     *
     * Retrieves the like count and user like status for a specific comment.
     *
     * @authenticated
     * @param int $comment
     * @return JsonResponse
     */
    public function getCommentLikes($comment): JsonResponse
    {
        try {
            $commentModel = \App\Models\Comment::findOrFail($comment);
            $likeCount = $commentModel->likes()->count();
            $userHasLiked = \Illuminate\Support\Facades\Auth::check() &&
                $commentModel->likes()->where('user_id', \Illuminate\Support\Facades\Auth::id())->exists();

            $this->response['data'] = [
                'like_count' => $likeCount,
                'user_has_liked' => $userHasLiked,
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
     * Get Total Comment Count
     *
     * Retrieves the total number of comments (including replies) for a specific post.
     *
     * @param int $postId
     * @return JsonResponse
     */
    public function getTotalCount($postId)
    {
        try {
            $totalWithReplies = $this->commentService->getTotalCommentsCount($postId);

            $this->response['data'] = [
                'total_with_replies' => $totalWithReplies,
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
     * Batch Total Comment Counts
     *
     * Returns total comment counts for multiple post IDs.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function batchTotalCounts(\Illuminate\Http\Request $request)
    {
        $postIds = $request->input('post_ids', []);
        if (!is_array($postIds)) {
            return response()->json(['error' => 'post_ids must be an array'], 400);
        }

        $counts = DB::table('comments')
            ->select('post_id', DB::raw('COUNT(*) as total_with_replies'))
            ->whereIn('post_id', $postIds)
            ->groupBy('post_id')
            ->pluck('total_with_replies', 'post_id');

        $result = [];
        foreach ($postIds as $id) {
            $result[$id] = isset($counts[$id]) ? $counts[$id] : 0;
        }

        return response()->json(['counts' => $result]);
    }
}