<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use App\Models\Abonne;
use App\Models\Abonnement;
use App\Models\AbonnementAll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SeanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Seance::all();
    }
    
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
    
            // Récupérer l'abonné
            $abonne = Abonne::where('telephone', $request->telephone)
                    ->orWhere('email', $request->telephone)
                    ->first();
            
            if (!$abonne) {
                return response()->json([
                    'success' => false,
                    'message' => 'Abonné non trouvé'
                ], 404);
            }
    
            // Récupérer tous les abonnements de l'abonné triés par priorité
            $abonnements = Abonnement::where('abonne_id', $abonne->id)
                            ->orderBy('date_fin', 'DESC') // Priorité aux abonnements les plus récents
                            ->get();
    
            $today = Carbon::today();
            $seanceCreee = false;
            $abonnementUtilise = null;
    
            foreach ($abonnements as $abonnement) {
                // Déterminer l'état actuel de l'abonnement
                $etat = $this->determinerEtatAbonnement($abonnement, $today);
                
                // Si l'abonnement est en cours, l'utiliser pour la séance
                if ($etat === 'ENCOURS' && !$seanceCreee) {
                    $seance = $this->creerSeance($abonne, $abonnement);
                    $abonnementUtilise = $abonnement;
                    $seanceCreee = true;
                    
                    // Mettre à jour l'état de l'abonnement
                    $this->mettreAJourEtatAbonnement($abonnement, $etat);
                    break;
                }
            }
    
            // Si aucun abonnement en cours, chercher un abonnement en pause
            if (!$seanceCreee) {
                foreach ($abonnements as $abonnement) {
                    $etat = $this->determinerEtatAbonnement($abonnement, $today);
                    
                    if ($etat === 'PAUSE' && !$seanceCreee) {
                        // Calculer les jours de pause
                        $joursEnPause = $this->calculerJoursEnPause($abonnement, $today);
                        
                        // Créer la séance
                        $seance = $this->creerSeance($abonne, $abonnement);
                        
                        // Reprendre l'abonnement
                        $this->reprendreAbonnementApresPause($abonnement, $joursEnPause);
                        
                        $abonnementUtilise = $abonnement;
                        $seanceCreee = true;
                        break;
                    }
                }
            }
            $nombre_seance = 0;
            if ($abonnementUtilise != null) {
                $abonnementUtilise = AbonnementAll::find($abonnementUtilise->id);
                $nombre_seance = Seance::where("abonnement_id", "=", $abonnementUtilise->id)->count();
            }
    
            // Mettre à jour les états de tous les abonnements
            $this->mettreAJourTousLesEtats($abonnements, $today);
    
            DB::commit();
    
            // Préparer la réponse
            $response = [
                'success' => true,
                'message' => $seanceCreee ? 'Séance créée avec succès' : 'Aucun abonnement actif disponible',
                'data' => [
                    'abonne' => $abonne,
                    'seance_creee' => $seanceCreee
                ]
            ];
    
            if ($seanceCreee && $abonnementUtilise) {
                $response['data']['abonnement_utilise'] = $abonnementUtilise;
                $response['data']['nombre_seance'] = $nombre_seance;
                
                if (isset($seance)) {
                    $response['data']['seance'] = $seance;
                }
            }
    
            return response()->json($response, $seanceCreee ? 200 : 404);
    
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Déterminer l'état d'un abonnement
     */
    private function determinerEtatAbonnement($abonnement, $today)
    {
        // Si en pause
        if ($abonnement->date_pause != null) {
            return 'PAUSE';
        }
        
        // Si date de fin dépassée
        if ($abonnement->date_fin && Carbon::parse($abonnement->date_fin)->lt($today)) {
            return 'EXPIRE';
        }
        
        // Sinon en cours
        return 'ENCOURS';
    }
    
    /**
     * Créer une nouvelle séance
     */
    private function creerSeance($abonne, $abonnement)
    {
        $existance = Seance::where("abonne_id", "=", $abonne->id)->Where("date_seance","=", Carbon::today())->first();
        if ($existance) {
            $existance->heure_fin = Carbon::now();
            $existance->save();
            return $existance;
        }
        $seance = new Seance();
        $seance->abonne_id = $abonne->id;
        $seance->abonnement_id = $abonnement->id;
        $seance->date_seance = Carbon::today();
        $seance->heure_debut = Carbon::now();
        $seance->save();
        
        return $seance;
    }
    
    /**
     * Calculer le nombre de jours en pause
     */
    private function calculerJoursEnPause($abonnement, $today)
    {
        $datePause = Carbon::parse($abonnement->date_pause);
        $dateFin = Carbon::parse($abonnement->date_fin);
        
        // Si la date de fin est dépassée, utiliser aujourd'hui comme limite
        if ($dateFin->lt($today)) {
            return $datePause->diffInDays($today);
        }
        
        return $datePause->diffInDays($dateFin);
    }
    
    /**
     * Reprendre un abonnement après pause
     */
    private function reprendreAbonnementApresPause($abonnement, $joursEnPause)
    {
        $dateFinActuelle = Carbon::parse($abonnement->date_fin);
        $today = Carbon::today();
        
        // Si la date de fin est déjà dépassée
        if ($dateFinActuelle->lt($today)) {
            // Nouvelle date de fin = aujourd'hui + jours de pause restants
            $abonnement->date_fin = $today->copy()->addDays($joursEnPause);
        } else {
            // Prolonger la date de fin du nombre de jours de pause
            $abonnement->date_fin = $dateFinActuelle->addDays($joursEnPause);
        }
        
        // Réinitialiser la date de pause
        $abonnement->date_pause = null;
        $abonnement->etat = 'ENCOURS';
        $abonnement->save();
    }
    
    /**
     * Mettre à jour l'état d'un abonnement
     */
    private function mettreAJourEtatAbonnement($abonnement, $etat)
    {
        $abonnement->etat = $etat;
        $abonnement->save();
    }
    
    /**
     * Mettre à jour les états de tous les abonnements
     */
    private function mettreAJourTousLesEtats($abonnements, $today)
    {
        foreach ($abonnements as $abonnement) {
            $etat = $this->determinerEtatAbonnement($abonnement, $today);
            
            if ($abonnement->etat !== $etat) {
                $abonnement->etat = $etat;
                $abonnement->save();
            }
        }
    }
    
    /**
     * Version alternative avec une seule requête pour les mises à jour en masse
     */
    private function mettreAJourEtatsEnMasse($abonneId, $today)
    {
        // Mettre à jour les expirés
        DB::table('abonnements')
            ->where('abonne_id', $abonneId)
            ->whereNull('date_pause')
            ->where('date_fin', '<', $today)
            ->where('etat', '!=', 'EXPIRE')
            ->update(['etat' => 'EXPIRE']);
        
        // Mettre à jour les en pause
        DB::table('abonnements')
            ->where('abonne_id', $abonneId)
            ->whereNotNull('date_pause')
            ->where('etat', '!=', 'PAUSE')
            ->update(['etat' => 'PAUSE']);
        
        // Mettre à jour les en cours
        DB::table('abonnements')
            ->where('abonne_id', $abonneId)
            ->whereNull('date_pause')
            ->where('date_fin', '>=', $today)
            ->where('etat', '!=', 'ENCOURS')
            ->update(['etat' => 'ENCOURS']);
    }
    
}
