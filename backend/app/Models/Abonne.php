<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Abonne extends Model
{
    use HasFactory;
    use SoftDeletes;
    /**
    * @var array
    */
   protected $fillable = [
      'nom',
      'prenom',
      'datenais',
      'telephone',
      'email',
      'genre',
      'observation',
      'lieunais',
      'file_name',
      'cnib',
      'updated_by',
      'created_by',
    ];
}