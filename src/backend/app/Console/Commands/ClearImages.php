<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ClearImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:clear-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes all images from storage/app/public/images';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $imagePath = storage_path('app/public/images');

        if (File::exists($imagePath)) {
            File::cleanDirectory($imagePath); // Deletes all files inside the folder
            $this->info('All images have been deleted from storage!');
        } else {
            $this->warn('The storage/images directory does not exist.');
        }
    }
}
