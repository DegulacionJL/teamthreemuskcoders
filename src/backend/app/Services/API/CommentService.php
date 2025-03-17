<?php

namespace App\Services\API;

use App\Models\Comment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class CommentService
{
    public function getComments($postId)
    {
        return Comment::where('post_id', $postId)->latest()->get();
    }

    public function addComment($data)
    {
        // Ensure user is authenticated before creating a comment
        if (!Auth::check()) {
            throw new Exception("Unauthorized. Please log in.");
        }

        $data['user_id'] = Auth::id(); // Set user_id from authenticated user

        return Comment::create($data);
    }

    public function updateComment($commentId, array $data)
    {
        try {
            $comment = Comment::findOrFail($commentId);

            // Ensure only the owner can update the comment
            if ($comment->user_id !== Auth::id()) {
                throw new Exception("Unauthorized. You can only update your own comments.");
            }

            $comment->update($data);
            return $comment;
        } catch (ModelNotFoundException $e) {
            throw new Exception("Comment not found.");
        } catch (Exception $e) {
            throw new Exception("Failed to update comment.");
        }
    }

    public function deleteComment($commentId, $postId)
{
    $comment = Comment::where('id', $commentId)->where('post_id', $postId)->first();
    
    if (!$comment) {
        throw new Exception("Comment not found.");
    }
    
    // Debug
    Log::info('User trying to delete: ' . Auth::id());
    Log::info('Comment owner: ' . $comment->user_id);
    
    // Ensure only the owner can delete the comment
    if ($comment->user_id !== Auth::id()) {
        throw new Exception("Unauthorized. You can only delete your own comments.");
    }
    
    $comment->delete();
}
}
