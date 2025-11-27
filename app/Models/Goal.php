<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'category_name',
        'category_color',
        'target_amount',
        'current_amount',
        'status',
        'deadline',
        'notes',
    ];
}
