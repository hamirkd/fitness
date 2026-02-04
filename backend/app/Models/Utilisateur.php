<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Utilisateur extends Model
{
  use SoftDeletes;

    protected $table = 'users';
    use HasFactory;
    /**
    * @var array
    */
   protected $fillable = [
      'updated_by',
      'created_by',
      'updated_at',
      'created_at',
      'email',
      'password','first_name','last_name','telephone','role','personnel_id','deleted_at','avatar'
    ];
    
    protected $hidden = [
      'password',
      'remember_token',
  ];
}
