<?php

namespace App\Services\API;

use App\Models\User;
use App\Models\Post;

class SearchService
{
    public function unifiedSearch(string $keyword, array $types, int $limit, int $page)
    {
        $results = collect();

        if (in_array('hashtag', $types)) {
            $hashtag = $keyword; // Use the provided keyword as the hashtag
            $hashtags = Post::whereNotNull('caption')
                ->where('caption', 'LIKE', "%#{$hashtag}%") // Match the specific hashtag
                ->selectRaw("SUBSTRING_INDEX(SUBSTRING_INDEX(caption, '#', -1), ' ', 1) as hashtag, COUNT(*) as posts_count")
                ->groupBy('hashtag')
                ->orderByDesc('posts_count')
                ->limit($limit)
                ->offset(($page - 1) * $limit)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'hashtag',
                        'name' => '#' . $item->hashtag,
                        'posts_count' => $item->posts_count,
                    ];
                });
        
            $results = $results->merge($hashtags);
        }

        if (in_array('post', $types)) {
            $posts = Post::where('caption', 'LIKE', "%{$keyword}%")
                ->limit($limit)
                ->offset(($page - 1) * $limit)
                ->get()
                ->map(function ($post) {
                    return [
                        'type' => 'post',
                        'id' => $post->id,
                        'content' => $post->caption,
                        'author' => $post->user->name ?? null,
                    ];
                });

            $results = $results->merge($posts);
        }

        if (in_array('hashtag', $types)) {
            $hashtags = Post::whereNotNull('caption')
                ->where('caption', 'LIKE', "%#{$keyword}%")
                ->selectRaw("SUBSTRING_INDEX(SUBSTRING_INDEX(caption, '#', -1), ' ', 1) as hashtag, COUNT(*) as posts_count")
                ->groupBy('hashtag')
                ->orderByDesc('posts_count')
                ->limit($limit)
                ->offset(($page - 1) * $limit)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'hashtag',
                        'name' => '#' . $item->hashtag,
                        'count' => $item->posts_count,
                    ];
                });

            $results = $results->merge($hashtags);
        }

        return $results;
    }
}