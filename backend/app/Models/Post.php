<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'status',
        'scheduled_time',
        'user_id',
    ];
    //
    public function platforms()
{
    return $this->belongsToMany(Platform::class, 'post_platform')->withPivot('platform_status');
}

}
