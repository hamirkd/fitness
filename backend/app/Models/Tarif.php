<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    use HasFactory;
    /**
    * @var array
    */
   protected $fillable = [
    'typetarif',
    'montant',
    'redevance',
    'autres_frais',
    'updated_by',
    'created_by',
    'updated_at',
    'created_at',
    ];
}