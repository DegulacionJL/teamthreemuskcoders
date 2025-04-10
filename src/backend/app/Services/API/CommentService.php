<?php

namespace App\Services\API;

use App\Models\Comment;
use App\Models\CommentLike;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Events\NotificationCreated;
use App\Models\Notification;


class CommentService
{
    /**
     * Get comments for a post.
     *
     * @param int $postId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getComments($postId, $perPage = 5, $page = 1)
    {
        $comments = Comment::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with(['user']) // Load only user, not replies here
            ->orderBy('created_at', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        $totalWithReplies = Comment::where('post_id', $postId)->count();

        return [
            'comments' => $comments,
            'total_with_replies' => $totalWithReplies,
            'has_more' => $comments->hasMorePages(),
        ];
    }

    /**
     * Get replies for a specific comment.
     *
     * @param int $postId
     * @param int $parentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
   public function getReplies($postId, $parentId, $perPage = 3, $page = 1)
    {
        $replies = Comment::where('post_id', $postId)
            ->where('parent_id', $parentId)
            ->with(['user'])
            ->orderBy('created_at', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        $totalWithReplies = Comment::where('post_id', $postId)->where('parent_id', $parentId)->count();

        return [
            'comments' => $replies,
            'total_with_replies' => $totalWithReplies,
            'has_more' => $replies->hasMorePages(),
        ];
    }
    /**
     * Add a new comment.
     *
     * @param array $data
     * @return Comment
     * @throws Exception
     */
    public function addComment($data)
    {
        // Ensure user is authenticated before creating a comment
        if (!Auth::check()) {
            throw new Exception("Unauthorized. Please log in.");
        }

        $data['user_id'] = Auth::id(); // Set user_id from authenticated user

        // Handle image if present
        if (isset($data['image']) && $data['image']->isValid()) {
            $imagePath = $data['image']->store('comment_images', 'public');
            $data['image'] = $imagePath;
        }

        $comment = Comment::create($data);

        // If this is a reply (has parent_id), create a notification
    if (!empty($data['parent_id'])) {
        $parentComment = Comment::with('user')->find($data['parent_id']);
        
        if ($parentComment && $parentComment->user_id !== Auth::id()) {
            // Create notification for the parent comment's owner
            $notification = Notification::create([
                'recipient_id' => $parentComment->user_id,
                'sender_id' => Auth::id(),
                'type' => 'comment_reply',
                'content' => 'replied to your comment',
                'notifiable_id' => $comment->id,
                'notifiable_type' => Comment::class,
            ]);

            // Dispatch notification event
            NotificationCreated::dispatch($notification);
        }
    }

        // Load the relationships
        return Comment::with(['user', 'replies.user'])->find($comment->id);
    }

    /**
     * Update an existing comment.
     *
     * @param int $commentId
     * @param int $postId
     * @param array $data
     * @return Comment
     * @throws Exception
     */
   public function updateComment($commentId, $postId, array $data)
{
    try {
        $comment = Comment::where('id', $commentId)
            ->where('post_id', $postId)
            ->firstOrFail();

        // Ensure only the owner can update the comment
        if ($comment->user_id !== Auth::id()) {
            throw new Exception("Unauthorized. You can only update your own comments.");
        }

        // Create a copy of data that we'll use for update
        $updateData = $data;
        
        // Handle image removal flag
        if (isset($data['remove_image']) && $data['remove_image'] === true) {
            // Delete old image if exists
            if ($comment->image && Storage::disk('public')->exists($comment->image)) {
                Storage::disk('public')->delete($comment->image);
            }
            // Set image to null explicitly
            $comment->image = null;
            // Remove flag from data before update
            unset($updateData['remove_image']);
        }
        // Handle new image upload
        elseif (isset($data['image']) && $data['image']->isValid()) {
            // Delete old image if exists
            if ($comment->image && Storage::disk('public')->exists($comment->image)) {
                Storage::disk('public')->delete($comment->image);
            }
            
            $imagePath = $data['image']->store('comment_images', 'public');
            $updateData['image'] = $imagePath;
        }
        // Important: remove 'image' from updateData if not explicitly set
        // to preserve the existing image relationship
        else {
            unset($updateData['image']);
        }

        $comment->update($updateData);

        // Reload the comment with user relationship
        return Comment::with(['user', 'replies.user'])->find($commentId);
    } catch (ModelNotFoundException $e) {
        throw new Exception("Comment not found for this post.");
    } catch (Exception $e) {
        throw new Exception("Failed to update comment: " . $e->getMessage());
    }
}

    /**
     * Delete a comment.
     *
     * @param int $commentId
     * @param int $postId
     * @throws Exception
     */
    public function deleteComment($commentId, $postId)
    {
        $comment = Comment::where('id', $commentId)
            ->where('post_id', $postId)
            ->first();

        if (!$comment) {
            throw new Exception("Comment not found for this post.");
        }

        if ($comment->user_id !== Auth::id()) {
            throw new Exception("Unauthorized. You can only delete your own comments.");
        }

        // Delete the image if it exists
        if ($comment->image && Storage::disk('public')->exists($comment->image)) {
            Storage::disk('public')->delete($comment->image);
        }

        $comment->delete();
    }

    /**
     * Like a comment.
     *
     * @param int $commentId
     * @return Comment
     * @throws Exception
     */
    public function likeComment($commentId)
{
    if (!Auth::check()) {
        throw new Exception("Unauthorized. Please log in.");
    }

    $comment = Comment::findOrFail($commentId);
    $userId = Auth::id();

    $existingLike = CommentLike::where('user_id', $userId)
        ->where('comment_id', $commentId)
        ->first();

    if ($existingLike) {
        return [
            'like_count' => $comment->likes()->count()
        ];
    }

    CommentLike::create([
        'user_id' => $userId,
        'comment_id' => $commentId
    ]);

    return [
        'like_count' => $comment->likes()->count()
    ];
}

    /**
     * Unlike a comment.
     *
     * @param int $commentId
     * @return Comment
     * @throws Exception
     */
    public function unlikeComment($commentId)
{
    if (!Auth::check()) {
        throw new Exception("Unauthorized. Please log in.");
    }

    $comment = Comment::findOrFail($commentId);
    $userId = Auth::id();

    $like = CommentLike::where('user_id', $userId)
        ->where('comment_id', $commentId)
        ->first();

    if ($like) {
        $like->delete();
    }

    return [
        'like_count' => $comment->likes()->count()
    ];
}

    public function getCommentLikes($commentId)
{
    $comment = Comment::findOrFail($commentId);
    $userId = Auth::check() ? Auth::id() : null;

    return [
        'like_count' => $comment->likes()->count(),
        'user_has_liked' => $userId ? $comment->likes()->where('user_id', $userId)->exists() : false
    ];
}

}