<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'metric_key',
        'target_min_pct',
        'target_max_pct',
        'deadline',
        'unit'
    ];
}
