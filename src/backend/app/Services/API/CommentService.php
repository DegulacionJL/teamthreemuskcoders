<?php

namespace App\Services\API;

use App\Models\Comment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; 
use Exception;

class CommentService
{
    public function getComments($postId)
    {
        return Comment::where('post_id', $postId)
            ->with('user') // Include the user relationship
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

    // Handle image if present
    if (isset($data['image']) && $data['image']->isValid()) {
        $imagePath = $data['image']->store('comment_images', 'public');
        $data['image'] = $imagePath;
    }

    return Comment::create($data);
}

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

        // Handle image removal flag
        if (isset($data['remove_image']) && $data['remove_image'] === true) {
            // Delete old image if exists
            if ($comment->image && Storage::disk('public')->exists($comment->image)) {
                Storage::disk('public')->delete($comment->image);
            }
            // Set image to null explicitly
            $comment->image = null;
            // Remove flag from data before update
            unset($data['remove_image']);
        }
        // Handle new image upload
        elseif (isset($data['image']) && $data['image']->isValid()) {
            // Delete old image if exists
            if ($comment->image && Storage::disk('public')->exists($comment->image)) {
                Storage::disk('public')->delete($comment->image);
            }
            
            $imagePath = $data['image']->store('comment_images', 'public');
            $data['image'] = $imagePath;
        }

        $comment->update($data);

        // Reload the comment with user relationship
        return Comment::with('user')->find($commentId);
    } catch (ModelNotFoundException $e) {
        throw new Exception("Comment not found for this post.");
    } catch (Exception $e) {
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

        $comment->delete();
    }
}