<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::where('user_id', Auth::id());

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('scheduled_time', $request->date);
        }

        return response()->json($query->with('platforms')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'scheduled_time' => 'required|date|after:now',
            'status' => 'required|in:draft,scheduled,published',
            'platforms' => 'required|array',
            'platforms.*' => 'exists:platforms,id'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $data['imd_url'] = Storage::url($path);
        }

        $scheduledToday = Post::whereDate('scheduled_time', now()->toDateString())
            ->where('user_id', Auth::id())
            ->count();

        if ($scheduledToday >= 10) {
            return response()->json(['message' => 'Limit of 10 scheduled posts per day reached.'], 429);
        }

        $platforms = Platform::whereIn('id', $data['platforms'])->pluck('name')->toArray();

        foreach ($platforms as $platform) {
            switch (strtolower($platform)) {
                case 'twitter':
                    if (strlen($data['content']) > 280) {
                        return response()->json(['message' => 'Content exceeds 280 characters for Twitter.'], 422);
                    }
                    break;
                case 'linkedin':
                    if (strlen($data['content']) > 1300) {
                        return response()->json(['message' => 'Content exceeds 1300 characters for LinkedIn.'], 422);
                    }
                    break;
                case 'instagram':
                    if (strlen($data['content']) > 2200) {
                        return response()->json(['message' => 'Content exceeds 2200 characters for Instagram.'], 422);
                    }
                    break;
                case 'tiktok':
                    if (strpos($data['content'], 'http://') !== false || strpos($data['content'], 'https://') !== false) {
                        return response()->json(['message' => 'TikTok content cannot contain links.'], 422);
                    }
                    break;
            }
        }

        $post = Post::create([
            ...$data,
            'user_id' => Auth::id()
        ]);

        $post->platforms()->attach($data['platforms']);

        return response()->json($post->load('platforms'), 201);
    }

    public function show($id)
    {
        $post = Post::with('platforms')->where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $post = Post::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $data = $request->validate([
            'title' => 'sometimes|string',
            'content' => 'sometimes|string',
            'image' => 'nullable|image|max:2048',
            'scheduled_time' => 'sometimes|date|after:now',
            'status' => 'sometimes|in:draft,scheduled,published',
            'platforms' => 'nullable|array',
            'platforms.*' => 'exists:platforms,id'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $data['imd_url'] = Storage::url($path);
        }

        $post->update($data);

        if (isset($data['platforms'])) {
            $post->platforms()->sync($data['platforms']);
        }

        return response()->json($post->load('platforms'));
    }

    public function destroy($id)
    {
        $post = Post::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }
}
