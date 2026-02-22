<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use MBence\OpenTBSBundle\Services\OpenTBS;
use App\Models\Abonne;
use App\Models\Abonnement;
use App\Models\AbonnementAll;
use App\Models\Tarif;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\Dompdf;
use Dompdf\Options;
use DateTime;

class AbonnementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Abonnement::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(isset($request['id'])&&$request['id']>0){
            $abonnement = Abonnement::find($request['id']);
            $abonnement->update(MyFunction::audit($request->all()));
            return response()->json([
                'message' => "L'abonnement a été mise à jour",
                'status' => 200
            ], 200);
        }
        $abonnement = $request->all();
        $abonne = Abonne::find($abonnement['abonne_id']);
        $abonnement['nom'] = $abonne->nom;
        $abonnement['prenom'] = $abonne->prenom;

        $tarif = Tarif::find($abonnement['tarif_id']);
        $abonnement['montant'] = $tarif->montant;
        $abonnement['duree'] = $tarif->duree;
        if ($abonnement['date_debut'] == null) {
            $abonnement['date_debut'] = Carbon::now();
            $abonnement['date_fin'] = Carbon::now()->addDays($tarif->duree-1);
        }

        $abonnement = Abonnement::create(MyFunction::audit($abonnement));
        $abonnement =  AbonnementAll::find($abonnement->id);
        return response()->json([
            'message' => 'Ajout d\'un nouveau abonnement',
            'abonnement' => $abonnement,
            'status' => 200
        ], 200);
    }

    /**
     * Création des abonnements d'une période données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function findBy(Request $request)
    {
        $abonnements = null;
        if ($request['datedebut'] && $request['datefin']) 
        $abonnements = Abonnement::whereBetween('created_at', [$request['datedebut'] , $request['datefin']]);
    
        if ($request['etat']) {
            $abonnements = Abonnement::where('etat', '=', $request['etat']);
        }
        if ($request['abonnement_id']) {
            $abonnements = Abonnement::where('abonnement_id', '=', $request['abonnement_id']);
        }
        if ($request['abonne_id']) {
            $abonnements = Abonnement::where('abonne_id', '=', $request['abonne_id']);
        }
        
        if ($abonnements == null) {
            $abonnements = Abonnement::orderBy('id', 'DESC');
        }
        
        $abonnements=$abonnements->orderBy('id','DESC')->get();

        $today = Carbon::today();
        
        foreach ($abonnements as $abonnement) {
            if ($abonnement->date_fin && Carbon::parse($abonnement->date_fin)->lt($today)
            && $abonnement->date_pause == null) {
                $abonnement->etat = 'EXPIRE';
                // si tu veux sauvegarder en base :
                $abonnement->save();
            } else if ($abonnement->date_pause != null) {
                $abonnement->etat = 'PAUSE';
                $abonnement->save();
            }
            else {
                $abonnement->etat = 'ENCOURS';
                $abonnement->save();
            }
        }
        
        return $abonnements;
    }


    public function imprimer(Request $request)
    {
        
        setlocale(LC_TIME, 'fr_FR.UTF-8');
        $abonnements = AbonnementAll::where('periode', '=', $request['periode']);
        if ($request['id']) {
            $abonnements =  AbonnementAll::where('id', '=', $request['id']);
        }
        if ($request['abonne_id']) {
            $abonnements =  AbonnementAll::where('abonne_id', '=', $request['abonne_id']);
        }
        if ($request['tarif_id']) {
            $abonnements =  AbonnementAll::where('tarif_id', '=', $request['tarif_id']);
        }
        $abonnements = $abonnements->get();
        $today = Carbon::today();
        foreach ($abonnements as $abonnement) {
            if ($abonnement->date_fin && Carbon::parse($abonnement->date_fin)->lt($today) && $abonnement->date_pause == null) {
                $abonnement->etat = 'EXPIRE';
                // si tu veux sauvegarder en base :
                $abonnement->save();
            } else if ($abonnement->date_pause != null) {
                $abonnement->etat = 'PAUSE';
                $abonnement->save();
            }
            else {
                $abonnement->etat = 'ENCOURS';
                $abonnement->save();
            }
        }
        $title = 'Abonnement';
        $html = view('abonnement', ['title' => $title,
        'abonnements' => $abonnements])->render();
         
        $options = new Options();
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        // $dompdf->setPaper('A4', 'portrait');
        $dompdf->setPaper('A7', 'portrait');
        $dompdf->render();
        $outputPath = storage_path('app/public/temp/ABONNEMENT.pdf');

        file_put_contents($outputPath, $dompdf->output());
        return response()->file($outputPath, ['Content-Type' => 'application/pdf']);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Abonnement  $abonnement
     * @return \Illuminate\Http\Response
     */
    public function show(Abonnement $abonnement)
    {
        return $abonnement;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Abonnement  $scolarite
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Abonnement $abonnement)
    {
        if ($abonnement->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette abonnement a déjà été payée",
                'status' => 409
            ], 409);
        }
        $abonnement->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Abonnement  $abonnement
     * @return \Illuminate\Http\Response
     */
    public function destroy(Abonnement $abonnement)
    {
        if ($abonnement->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette abonnement a déjà été payée",
                'status' => 409
            ], 409);
        }
        $abonnement->delete();
    }
    
    public function cancelled_at(Request $request)
    {
        $request->validate([
            'id'    => 'required|exists:fit_abonnements,id',
            'motif' => 'required|string|max:255',
        ]);
    
        $abonnement = Abonnement::findOrFail($request->id);
    
        if ($abonnement->etat === 'PAYE') {
            return response()->json([
                'message' => "Cet abonnement a déjà été payé",
                'status'  => 409
            ], 409);
        }
    
        $abonnement->update([
            'cancelled_at' => now(),
            'motif'        => $request->motif
        ]);
    
        return response()->json([
            'message' => "Abonnement annulé avec succès",
            'status'  => 200,
            'data'    => $abonnement
        ]);
    }

    public function restore(Request $request)
    {
        $abonnement = Abonnement::find($request->id);
        if ($abonnement->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette abonnement a déjà été payée",
                'status' => 409
            ], 409);
        }
        return $abonnement->update(["cancelled_at"=>null,"motif"=>null]);
    }

    public function paye(Request $request)
    {
        $abonnement = Abonnement::find($request->id);
        return $abonnement->update(["etat"=>'PAYE', "datepaiement"=> now()]);
    }
    
    
}
