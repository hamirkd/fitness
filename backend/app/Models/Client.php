<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
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
      'typeclient',
      'lieunais',
      'file_name',
      'cnib',
      'numerocompteur',
      'ancienindex',
      'longitude',
      'latitude',
      'updated_by',
      'created_by',
    ];
}