<?php

namespace App\Services\API;

use App\Models\Comment;

class CommentService
{
    public function getComments($postId)
    {
        return Comment::where('post_id', $postId)->latest()->get();
    }

    public function addComment($data)
    {
        return Comment::create($data);
    }

    public function deleteComment($commentId)
    {
        $comment = Comment::findOrFail($commentId);
        return $comment->delete();
    }
}