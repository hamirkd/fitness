<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Abonnement extends Model
{
    protected $table = 'fit_abonnements';
    use HasFactory;
    use SoftDeletes;
    /**
    * @var array
    */
   protected $fillable = [
    'abonne_id',
    'nom',
    'prenom',
    'date_debut',
    'date_fin',
    'duree',
    'tarif_id',
    'montant',
    'cancelled_at',
    'motif',
    'mode_paiement','date_pause',
    'updated_by',
    'created_by'
    ];
    public function getCreatedAttribute()
    {
        $user =  Utilisateur::find($this->created_by);
        return $user->first_name.' '.$user->last_name;
    }
    protected $appends = ['created'];

}