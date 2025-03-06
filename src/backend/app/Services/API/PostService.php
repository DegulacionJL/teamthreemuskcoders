<?php

namespace App\Services\API;

use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Image;
use Exception;

class PostService
{

    protected $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function createMemePost(string $caption, $image, int $user_id)
{
    if (!$user_id) {
        throw new Exception('User ID is missing');
    }

    $imagePath = null;

    // Store the image if provided
    if ($image) {
        $imagePath = env('STORAGE_DISK_URL').'/'.$image->store('images', 'public'); // Saves to storage/app/public/images
        // $imagePath = str_replace('public/', 'storage/', $imagePath); 
    }

    // Create the post with the image path
    $post = Post::create([
        'caption' => $caption,
        'user_id' => $user_id,
        'image' => $imagePath,
         // Save the image path in the database
    ]);
    // dump($imagePath);

    if (!$post) {
        return response()->json(['error' => 'Failed to create post'], 500);
    }

    return $post;
}
    public function likePost(int $post_id, int $user_id)
    {
        // Create the like
        $like = Like::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
        ]);

        return $like;
    }

    public function commentPost(int $post_id, int $user_id, string $content)
    {
        // Create the comment
        $comment = Comment::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
            'content' => $content,
        ]);

        return $comment;
    }

    public function getPost($post_id)
    {
        $post = Post::find($post_id);

        if (!$post) {
            throw new Exception('Post not found');
        }

        return $post;
    }

    public function getPosts()
    {
        $posts = Post::all();

        return $posts;
    }

    public function getPostLikes($post_id)
    {
        $post = Post::find($post_id);

        if (!$post) {
            throw new Exception('Post not found');
        }

        $likes = $post->likes;

        return $likes;
    }

    public function getPostComments($post_id)
    {
        $post = Post::find($post_id);

        if (!$post) {
            throw new Exception('Post not found');
        }

        $comments = $post->comments;

        return $comments;
    }
}