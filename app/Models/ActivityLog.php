<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'entity',
        'entity_id',
        'changes',
    ];

    protected $casts = [
        'changes' => 'array',
    ];
}
