<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AbonnementAll extends Model
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
    'updated_by',
    'created_by'
    ];
    public function getAbonneAttribute()
    {
        return Abonne::find($this->abonne_id);
    }
    public function getTarifAttribute()
    {
        return Tarif::find($this->tarif_id);
    }
    protected $appends = ['abonne', 'tarif'];
}