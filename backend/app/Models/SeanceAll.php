<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeanceAll extends Model
{
    protected $table = 'fit_seances';
    use HasFactory;
    /**
    * @var array
    */
    protected $fillable = [
        'abonne_id',
        'abonnement_id',
        'date_seance',
        'heure_debut',
        'heure_fin',
        'statut',
        'updated_by',
        'created_by',
        'updated_at',
        'created_at',
    ];
    protected $casts = [
        'date_seance' => 'date',
        'heure_debut' => 'datetime',
        'heure_fin' => 'datetime'
    ];
    public function abonne()
    {
        return $this->belongsTo(Abonne::class);
    }
    
    public function abonnement()
    {
        return $this->belongsTo(Abonnement::class);
    }
}