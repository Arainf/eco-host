<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index()
    {
        return User::select('id', 'name', 'email', 'is_admin', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'is_admin' => 'boolean'
        ]);

        $validated['password'] = Hash::make($validated['password']);

        return User::create($validated);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent admin from demoting themselves
        if ($user->id === auth()->id() && !$request->is_admin) {
            return response()->json(['error' => "You can't remove your own admin role."], 422);
        }

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => "required|email|unique:users,email,{$id}",
            'is_admin' => 'boolean'
        ]);

        $user->update($validated);

        return $user;
    }

    public function destroy($id)
    {
        // Prevent deleting yourself
        if ($id == auth()->id()) {
            return response()->json(['error' => "You can't delete your own account."], 422);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
