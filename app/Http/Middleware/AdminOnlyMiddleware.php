<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminOnlyMiddleware
{
    public function handle($request, Closure $next)
    {
        if (!auth()->check() || auth()->user()->is_admin !== true) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return $next($request);
    }
}
