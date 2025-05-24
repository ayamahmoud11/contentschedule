<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use Carbon\Carbon;

class PublishScheduledPosts extends Command
{
   
    protected $signature = 'publish:scheduled-posts';

    protected $description = 'Publish posts that are scheduled for now or earlier';

    public function handle()
    {
        $now = Carbon::now();

        $postsToPublish = Post::where('status', 'scheduled')
                              ->where('scheduled_time', '<=', $now)
                              ->get();

        foreach ($postsToPublish as $post) {
            $post->status = 'published';
            $post->save();

            $this->info("Post ID {$post->id} published.");
        }

        $this->info('All due posts have been published.');

        return 0;
    }
}
