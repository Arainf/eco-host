<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;

class ActivityController extends Controller
{
    public function index()
    {
        return ActivityLog::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
