<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostPlateform extends Model
{
    //
    public function posts()
{
    return $this->belongsToMany(Post::class, 'post_platform')->withPivot('platform_status');
}

}
