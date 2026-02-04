<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Versement extends Model
{
    use HasFactory;
    use SoftDeletes;
    /**
    * @var array
    */
   protected $fillable = [
      'client_id',
      'tarif_id',
      'montant',
      'motif',
      'dateversement',
      'deleted_at',
      'cancelled_at',
      'updated_by',
      'created_by',
      'updated_at',
      'created_at',
    ];
    
}