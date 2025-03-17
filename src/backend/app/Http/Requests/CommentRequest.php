<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Change this based on your auth logic
    }

  protected function prepareForValidation()
{
    // Ensure we get an array from the config
    $badWords = config('badwords.words', []);

    // Check if $badWords is an array
    if (!is_array($badWords)) {
        $badWords = [];
    }

    // Replace each bad word dynamically based on its length
    $text = $this->text;

    foreach ($badWords as $word) {
        $wordPattern = '/\b' . preg_quote($word, '/') . '\b/i'; // Match exact word
        $replacement = str_repeat('*', strlen($word)); // Generate correct number of asterisks
        $text = preg_replace($wordPattern, $replacement, $text);
    }

    // Update request with the censored text
    $this->merge([
        'text' => $text,
    ]);
}


    public function rules()
    {
        // Base rules
        $rules = [
            'text' => 'required|string|max:500',
        ];
        
        // No need to require post_id as it comes from the URL parameter
        
        return $rules;
    }
}