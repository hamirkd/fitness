<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use MBence\OpenTBSBundle\Services\OpenTBS;
use App\Models\Client;
use App\Models\Abonnement;
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
                'message' => "La abonnement a été mise à jour",
                'status' => 200
            ], 200);
        }
        Abonnement::create(MyFunction::audit($request->all()));
        return response()->json([
            'message' => 'Ajout d\'une nouvelle abonnement',
            'status' => 200
        ], 200);
    }
    /**
     * Création des abonnements d'une période données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function nouvelle(Request $request)
    {
        $abonnements = Abonnement::where('periode', '=', $request['periode'])->get();
        $abonnementPasse = array();
        if (count($abonnements)>0) {
            $abonnementPasse = Abonnement::where('periode', '>', $abonnements[0]['periode'])->get();
        }
        
        if (count($abonnementPasse)>0) {
            return response()->json([
                'message' => "Impossible de générer des abonnements anciennes si des nouvelles abonnements existent",
                'status' => 409
            ], 409);
        }
        if (count($abonnements) > 0) {
            if ($request['type'] && $request['type'] == 'REGENERE') {
                Abonnement::where('periode', '=', $request['periode'])->delete();
            } else
            return response()->json([
                'message' => "Il existe déjà des abonnements générées à cette période",
                'status' => 200
            ], 403);
        }
        $clients = Client::all();
        $tarifs = Tarif::all();
        
        if (count($tarifs) < 2) {
            return response()->json([
                'message' => "Veuillez saisir les tarifications ORDINAIRE ET ENTREPRISE",
                'status' => 200
            ], 404);
        }
        $setTarifs = [];
        foreach ($tarifs as $tarif) {
            $setTarifs[$tarif->typetarif] = $tarif;
        }
        foreach ($clients as $client) {
            Abonnement::create(MyFunction::audit([
                'client_id'=> $client->id,
                'nom'=>$client->nom,
                'prenom'=>$client->prenom,
                'periode'=>$request->periode,
                'typeclient'=>$client->typeclient,
                'ancienindex'=>$client->ancienindex,
                'tarif_id'=>$setTarifs[$client->typeclient]->id,
                'prixunitaire'=>$setTarifs[$client->typeclient]->montant,
                'redevance'=>$setTarifs[$client->typeclient]->redevance,
                'etat'=> 'NONPAYE'
            ]));
        }
        return Abonnement::where('periode', '=', $request['periode'])->get();
    }

    /**
     * Création des abonnements d'une période données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function findBy(Request $request)
    {
        if ($request['periode']) {
            return Abonnement::where('periode', '=', $request['periode'])->get();
        }
        if ($request['datedebut'] && $request['datefin'])
        return Abonnement::whereBetween('periode', [$request['datedebut'] , $request['datefin']])->get();
    
        if ($request['etat']) {
            return Abonnement::where('etat', '=', $request['etat'])->get();
        }
        if ($request['client_id']) {
            return Abonnement::where('client_id', '=', $request['client_id'])->get();
        }
    }

    
    /**
     * Création des abonnements d'une période données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addMost(Request $request)
    {
        $abonnements = $request['abonnements'];
        // Impossible de modifier les anciennes abonnements si des nouvelles abonnements existent
        $abonnementPasse = Abonnement::where('periode', '>', $abonnements[0]['periode'])->get();
        if (count($abonnementPasse)>0) {
            return response()->json([
                'message' => "Impossible de modifier les anciennes abonnements si des nouvelles abonnements existent",
                'status' => 409
            ], 409);
        }
        foreach ($abonnements as $abonnement) {
            if(isset($abonnement['id'])&&$abonnement['id']>0){
                $abonnementt = Abonnement::find($abonnement['id']);
                
                if ($abonnement['etat'] !== 'PAYE') {
                    $abonnementt->update(MyFunction::audit($abonnement));
                    Client::find($abonnement['client_id'])->update(["ancienindex"=>$abonnement['nouveauindex']]);
                }
            } else {
                return response()->json([
                    'message' => "Cette abonnement n'existe pas, veuillez verifier à nouveau",
                    'status' => 409
                ], 409);
            }
        }
        return response()->json([
            'message' => "Les abonnements ont été mise à jour",
            'status' => 200
        ], 200);
    }

    public function imprimer(Request $request)
    {
        
        setlocale(LC_TIME, 'fr_FR.UTF-8');
        $abonnements = Abonnement::where('periode', '=', $request['periode']);
        if ($request['id']) {
            $abonnements =  Abonnement::where('id', '=', $request['id']);
        }
        if ($request['client_id']) {
            $abonnements =  Abonnement::where('client_id', '=', $request['client_id']);
        }
        $abonnements = $abonnements->get();
        $title = 'Abonnement';
        $html = view('abonnement', ['title' => $title,
        'abonnements' => $abonnements])->render();
         
        $options = new Options();
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        // $dompdf->setPaper('A4', 'portrait');
        $dompdf->setPaper('A6', 'portrait');
        $dompdf->render();
        $outputPath = storage_path('app/public/temp/FACTURE.pdf');

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
    
    public function cancelle(Request $request)
    {
        $abonnement = Abonnement::find($request->id);
        if ($abonnement->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette abonnement a déjà été payée",
                'status' => 409
            ], 409);
        }
         
        return $abonnement->update(["cancelled_at"=>now(),"motif"=>$request->motif]);
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
