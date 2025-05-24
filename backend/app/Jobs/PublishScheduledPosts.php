<?php
namespace App\Jobs;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
class PublishScheduledPosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $posts = Post::where('status', 'scheduled')
        ->where('scheduled_time', '<=', now())
        ->get();
        foreach ($posts as $post) {
            $post->update(['status' => 'published']);
            \Log::info("Post {$post->id} published by scheduler.");
        }

    }
}
