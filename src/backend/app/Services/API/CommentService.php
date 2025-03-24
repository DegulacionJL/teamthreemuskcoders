<?php

namespace App\Services\API;

use App\Models\Comment;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CommentService
{
    /**
     * Get comments for a post.
     *
     * @param int $postId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getComments($postId)
    {
        // Get only top-level comments (no parent)
        return Comment::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with(['user', 'replies.user', 'replies.replies.user', 'replies.replies.replies.user', 'replies.replies.replies.replies.user'])
            ->latest()
            ->get();
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
}