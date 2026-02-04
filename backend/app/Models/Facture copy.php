<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facture extends Model
{
    use HasFactory;
    use SoftDeletes;
    /**
    * @var array
    */
   protected $fillable = [
    'client_id',
    'nom',
    'prenom',
    'periode',
    'ancienindex',
    'nouveauindex',
    'consommation',
    'prixunitaire',
    'tarif_id',
    'montant',
    'redevance',
    'montanttotal',
    'etat ',
    'datepaiement',
    'dateecheance',
    'updated_by',
    'created_by'
    ];
}