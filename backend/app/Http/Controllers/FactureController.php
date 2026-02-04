<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use MBence\OpenTBSBundle\Services\OpenTBS;
use App\Models\Client;
use App\Models\Facture;
use App\Models\Tarif;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\Dompdf;
use Dompdf\Options;
use DateTime;

class FactureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Facture::all();
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
            $facture = Facture::find($request['id']);
            $facture->update(MyFunction::audit($request->all()));
            return response()->json([
                'message' => "La facture a été mise à jour",
                'status' => 200
            ], 200);
        }
        Facture::create(MyFunction::audit($request->all()));
        return response()->json([
            'message' => 'Ajout d\'une nouvelle facture',
            'status' => 200
        ], 200);
    }
    /**
     * Création des factures d'une période données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function nouvelle(Request $request)
    {
        $factures = Facture::where('periode', '=', $request['periode'])->get();
        $facturePasse = array();
        if (count($factures)>0) {
            $facturePasse = Facture::where('periode', '>', $factures[0]['periode'])->get();
        }
        
        if (count($facturePasse)>0) {
            return response()->json([
                'message' => "Impossible de générer des factures anciennes si des nouvelles factures existent",
                'status' => 409
            ], 409);
        }
        if (count($factures) > 0) {
            if ($request['type'] && $request['type'] == 'REGENERE') {
                Facture::where('periode', '=', $request['periode'])->delete();
            } else
            return response()->json([
                'message' => "Il existe déjà des factures générées à cette période",
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
            Facture::create(MyFunction::audit([
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
        return Facture::where('periode', '=', $request['periode'])->get();
    }

    /**
     * Création des factures d'une période données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function findBy(Request $request)
    {
        if ($request['periode']) {
            return Facture::where('periode', '=', $request['periode'])->get();
        }
        if ($request['datedebut'] && $request['datefin'])
        return Facture::whereBetween('periode', [$request['datedebut'] , $request['datefin']])->get();
    
        if ($request['etat']) {
            return Facture::where('etat', '=', $request['etat'])->get();
        }
        if ($request['client_id']) {
            return Facture::where('client_id', '=', $request['client_id'])->get();
        }
    }

    
    /**
     * Création des factures d'une période données.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addMost(Request $request)
    {
        $factures = $request['factures'];
        // Impossible de modifier les anciennes factures si des nouvelles factures existent
        $facturePasse = Facture::where('periode', '>', $factures[0]['periode'])->get();
        if (count($facturePasse)>0) {
            return response()->json([
                'message' => "Impossible de modifier les anciennes factures si des nouvelles factures existent",
                'status' => 409
            ], 409);
        }
        foreach ($factures as $facture) {
            if(isset($facture['id'])&&$facture['id']>0){
                $facturet = Facture::find($facture['id']);
                
                if ($facture['etat'] !== 'PAYE') {
                    $facturet->update(MyFunction::audit($facture));
                    Client::find($facture['client_id'])->update(["ancienindex"=>$facture['nouveauindex']]);
                }
            } else {
                return response()->json([
                    'message' => "Cette facture n'existe pas, veuillez verifier à nouveau",
                    'status' => 409
                ], 409);
            }
        }
        return response()->json([
            'message' => "Les factures ont été mise à jour",
            'status' => 200
        ], 200);
    }

    public function imprimer(Request $request)
    {
        
        setlocale(LC_TIME, 'fr_FR.UTF-8');
        $factures = Facture::where('periode', '=', $request['periode']);
        if ($request['id']) {
            $factures =  Facture::where('id', '=', $request['id']);
        }
        if ($request['client_id']) {
            $factures =  Facture::where('client_id', '=', $request['client_id']);
        }
        $factures = $factures->get();
        $title = 'Facture';
        $html = view('facture', ['title' => $title,
        'factures' => $factures])->render();
         
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
     * @param  \App\Models\Facture  $facture
     * @return \Illuminate\Http\Response
     */
    public function show(Facture $facture)
    {
        return $facture;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Facture  $scolarite
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Facture $facture)
    {
        if ($facture->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette facture a déjà été payée",
                'status' => 409
            ], 409);
        }
        $facture->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Facture  $facture
     * @return \Illuminate\Http\Response
     */
    public function destroy(Facture $facture)
    {
        if ($facture->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette facture a déjà été payée",
                'status' => 409
            ], 409);
        }
        $facture->delete();
    }
    
    public function cancelle(Request $request)
    {
        $facture = Facture::find($request->id);
        if ($facture->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette facture a déjà été payée",
                'status' => 409
            ], 409);
        }
         
        return $facture->update(["cancelled_at"=>now(),"motif"=>$request->motif]);
    }

    public function restore(Request $request)
    {
        $facture = Facture::find($request->id);
        if ($facture->etat == 'PAYE') {
            return response()->json([
                'message' => "Cette facture a déjà été payée",
                'status' => 409
            ], 409);
        }
        return $facture->update(["cancelled_at"=>null,"motif"=>null]);
    }

    public function paye(Request $request)
    {
        $facture = Facture::find($request->id);
        return $facture->update(["etat"=>'PAYE', "datepaiement"=> now()]);
    }
    
    
}
