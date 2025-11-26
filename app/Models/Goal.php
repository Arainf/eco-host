<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'category_name',
        'target_pct',
        'current_pct',
        'deadline',
        'notes',
    ];
}
