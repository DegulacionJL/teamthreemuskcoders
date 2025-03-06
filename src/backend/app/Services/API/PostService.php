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

         $post = Post::create([
            'caption' => $caption,
            'user_id' => $user_id,
        ]);

        if (!$post) {
            throw new Exception('Failed to create post');
        }

        // Create the image
        if ($image) {
            $imagePath = $image->store('images', 'public');
            Image::create([
                'url' => $imagePath,
                'post_id' => $post->id,
                'user_id' => $user_id,
            ]);
            $post->url=$imagePath;
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