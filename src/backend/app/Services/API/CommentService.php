<?php

namespace App\Services;

use App\Models\Comment;

class CommentService
{
    /**
     * Get all comments.
     */
    public function getAll()
    {
        return Comment::latest()->get();
    }

    /**
     * Store a new comment.
     */
    public function store(array $data)
    {
        return Comment::create($data);
    }

    /**
     * Find a comment by ID.
     */
    public function find($id)
    {
        return Comment::findOrFail($id);
    }

    /**
     * Update a comment.
     */
    public function update($id, array $data)
    {
        $comment = Comment::findOrFail($id);
        $comment->update($data);
        return $comment;
    }

    /**
     * Delete a comment.
     */
    public function delete($id)
    {
        $comment = Comment::findOrFail($id);
        return $comment->delete();
    }
}
