<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',

        'expense_name',

        'category_name',
        'category_color',
        'subcategory_name',

        'description',
        'amount',
        'date',
        'remarks',
    ];

    /**
     * Relationship: Expense belongs to a User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
