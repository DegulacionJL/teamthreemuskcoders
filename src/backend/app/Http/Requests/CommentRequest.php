<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class CommentRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Change this based on your auth logic
    }

  protected function prepareForValidation()
{
    // Skip this if text is not set
    if (!$this->has('text')) {
        return;
    }

    $text = $this->text;
    
    // Log the incoming text
    Log::debug('Comment text before processing:', ['text' => $text]);
    
    // Rest of your bad word filtering...
    $badWords = config('badwords.words', []);
    if (!is_array($badWords)) {
        $badWords = [];
    }

    foreach ($badWords as $word) {
        $wordPattern = '/\b' . preg_quote($word, '/') . '\b/i';
        $replacement = str_repeat('*', strlen($word));
        $text = preg_replace($wordPattern, $replacement, $text);
    }

    // Log the processed text
    Log::debug('Comment text after processing:', ['text' => $text]);
    
    $this->merge([
        'text' => $text,
    ]);
}


    public function rules()
    {
        // Base rules
        $rules = [
            'text' => 'string|max:500',
            'parent_id' => 'nullable|exists:comments,id',
            'image_url' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ];
        
        // No need to require post_id as it comes from the URL parameter
        
        return $rules;
    }
}