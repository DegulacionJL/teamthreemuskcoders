<?php

namespace App\Services\API;

use App\Models\Comment;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;
use Illuminate\Support\Str;

class CommentService
{
    public function getComments($postId)
    {
        return Comment::where('post_id', $postId)
            ->with('user')
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
        
        // Handle base64 image if present
        if (isset($data['image']) && !empty($data['image'])) {
            $data['image_path'] = $this->saveImage($data['image']);
            unset($data['image']); // Remove the base64 string from data after saving
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
            
            // Handle base64 image if present
            if (isset($data['image']) && !empty($data['image'])) {
                // Delete old image if exists
                if ($comment->image_path && Storage::disk('public')->exists($comment->image_path)) {
                    Storage::disk('public')->delete($comment->image_path);
                }
                
                $data['image_path'] = $this->saveImage($data['image']);
                unset($data['image']); // Remove the base64 string from data after saving
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

        // Delete associated image if exists
        if ($comment->image_path && Storage::disk('public')->exists($comment->image_path)) {
            Storage::disk('public')->delete($comment->image_path);
        }

        $comment->delete();
    }
    
    /**
     * Save base64 encoded image to storage
     * 
     * @param string $base64Image
     * @return string The path where the image is stored
     */
    private function saveImage($base64Image)
    {
        // Extract the file content
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));
        
        // Generate a unique filename
        $filename = 'comment_images/' . Str::uuid() . '.jpg';
        
        // Store the file
        Storage::disk('public')->put($filename, $imageData);
        
        return $filename;
    }
}