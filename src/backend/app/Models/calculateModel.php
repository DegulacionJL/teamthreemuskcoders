<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class calculateModel extends Model
{
    use HasFactory;
    protected $fillable = ['num1', 'num2', 'result'];
}
