<?php

namespace App\Services\API;

use App\Models\Comment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;


class CommentService
{
    public function getComments($postId)
    {
        return Comment::where('post_id', $postId)
        ->whereNull('parent_id') // Only get top-level comments
        ->with(['user', 'replies.user']) // Include the user relationship and replies
        ->latest()
        ->get();
    }

    public function addComment($data)
    {
        // Ensure user is authenticated before creating a comment
        if (!Auth::check()) {
            throw new Exception("Unauthorized. Please log in.");
        }

        $data['user_id'] = Auth::id(); // Set user_id from authenticated user

        if (isset($data['image_url']) && $data['image_url']) {
            $imagePath = $data['image_url']->store('comments-images', 'public');
            $data['image_url'] = $imagePath;
        }

        return Comment::create($data);
    }

    public function updateComment($commentId, $postId, array $data)
{
    try {
        $comment = Comment::where('id', $commentId)
            ->where('post_id', $postId)
            ->firstOrFail();

        // Debug what data is being received
        Log::debug('Update comment data received:', $data);
        
        // Ensure only the owner can update the comment
        if ($comment->user_id !== Auth::id()) {
            throw new Exception("Unauthorized. You can only update your own comments.");
        }

        // Create an update array with only the fields we want to update
        $updateData = [];
        
        // IMPORTANT: Always explicitly include text in the update
        $updateData['text'] = $data['text'] ?? '';
        Log::debug('Text being saved:', ['text' => $updateData['text']]);

        // Handle image upload if present
        if (isset($data['image_url']) && $data['image_url']) {
            // Delete old image if exists
            if ($comment->image_url) {
                Storage::disk('public')->delete($comment->image_url);
            }
            
            // Make sure we're storing the file correctly
            $imagePath = $data['image_url']->store('comments-images', 'public');
            $updateData['image_url'] = $imagePath;
            Log::debug('Image path being saved:', ['path' => $imagePath]);
        }

        // Apply the updates
        $comment->update($updateData);
        
        // Reload the comment with user relationship and replies
        $updatedComment = Comment::with(['user', 'replies.user'])->find($commentId);
        Log::debug('Updated comment:', $updatedComment->toArray());
        
        return $updatedComment;
    } catch (ModelNotFoundException $e) {
        Log::error('Comment not found:', ['commentId' => $commentId, 'postId' => $postId]);
        throw new Exception("Comment not found for this post.");
    } catch (Exception $e) {
        Log::error('Update comment error:', ['message' => $e->getMessage()]);
        throw new Exception("Failed to update comment: " . $e->getMessage());
    }
}

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

        // Delete the image in the comment if exists
        if ($comment->image_url) {
            Storage::disk('public')->delete($comment->image_url);
        }

        $comment->delete();
    }
}