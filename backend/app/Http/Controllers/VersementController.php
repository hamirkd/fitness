<?php

namespace App\Http\Controllers;

use App\Models\Versement;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use MBence\OpenTBSBundle\Services\OpenTBS;
use App\Models\Eleve;
use App\Models\AnneeScolaire;
use App\Models\Classe;
use App\Models\SalleClasse;
use App\Models\Scolarite;
use Carbon\Carbon;
use DateTime;

class VersementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Versement::all();
    }

 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request['annee_id'] = getallheaders()['annee_id'];
        if(isset($request['id'])&&$request['id']>0){
            $scolarite = Versement::find($request['id']);
            $scolarite->update($request->all());
            return response()->json([
                'message' => "Le versement a été mise à jour",
                'status' => 200
            ], 200);
        }
        Versement::create($request->all());
        return response()->json([
            'message' => 'Ajout d\'un versement',
            'status' => 200
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Versement  $scolarite
     * @return \Illuminate\Http\Response
     */
    public function show(Versement $scolarite)
    {
        return $scolarite;
    } 

    /**
     * Display a listing of the resource by Classe.
     *
     * @return \Illuminate\Http\Response
     */
    public function getListByAnnee($annee)
    {
        
        return Versement::where("annee_id",$annee)->get();
    }

    /**
     * Display a listing of the resource by Classe.
     *
     * @return \Illuminate\Http\Response
     */
    public function getByAnneeInscription(Request $request)
    {
        return Versement::where('annee_id','=',$request['annee_id'])
        ->where('inscription_id','=',$request['inscription_id'])
        ->get();
    }
    /**
     * Display a listing of the resource by Classe.
     *
     * @return \Illuminate\Http\Response
     */
    public function getEleveDetailVersementByAnneeAndEleve(Request $request)
    {
        $inscription = Inscription::where("eleve_id","=",$request["eleve_id"])->where("annee_id","=",$request["annee_id"])->first();
        $versements = Versement::where('inscription_id','=',$inscription->id)->get();
        $scolarite = Scolarite::where("annee_id","=",$inscription->annee_id)
                            ->where("serie","=",$inscription->serie)
                            ->where("classe_id","=",$inscription->classe_id)->first();
        $montant_scolarite = 0;
        $montant_verse = 0;
        if(isset($scolarite))
        $montant_scolarite = ($inscription->affecte =="NON"?$scolarite->frais_scolarite:$scolarite->frais_scolarite_affecte)+$scolarite->frais_inscription+$scolarite->autres_frais;
        if(isset($versements)){
            foreach ($versements as $versement ) {
                $montant_verse = $montant_verse + $versement->montant;
            }
        }
        return [
            "versements"=>$versements,
            "montant_scolarite"=>$montant_scolarite,
            "montant_verse"=>$montant_verse
        ];
    }

    /**
     * Display a listing of the resource by Classe.
     *
     * @return \Illuminate\Http\Response
     */
    public function getVersementByAnneeOrAll(Request $request)
    {
        $versements = Versement::orderBy('versements.dateversement', 'DESC');
        if(isset($request->annee_id)&&$request->annee_id!=null&&$request->annee_id!=0){
            $versements->where('versements.annee_id','=', $request['annee_id'] );
        }  
        if(isset($request->datedebut)&&$request->datedebut!=null&&$request->datedebut!=0){
            $versements->whereBetween('versements.dateversement',[$request['datedebut']." 00:00:00", $request['datefin']." 23:59:59"]);
        }
        $versements = $versements->get();
        foreach ($versements as $versement) {
            $eleve  = Inscription::find($versement->inscription_id)->eleve;
            $versement['nomprenom'] = $eleve->nom." ".$eleve->prenom;
            $versement['matricule'] = $eleve->matricule;
            $versement['eleve_idd2'] = $eleve->id;
            $versement['eleve'] = $eleve;
         }

       return $versements;
    }

    

    /**
     * Display a listing of the resource by Classe.
     *
     * @return \Illuminate\Http\Response
     */
    public function getVersementByAnneeOrAllGroupeBy(Request $request)
    {
         
        $inscriptions = Inscription::where("annee_id","=",$request->annee_id);
        if(isset($request->classe_id)&&$request->classe_id>0){
            $inscriptions->where('classe_id','=', $request->classe_id);
        }
        if(isset($request->salle_classe_id)&&$request->salle_classe_id>0){
            $inscriptions->where('salle_classe_id','=', $request->salle_classe_id);
        }
        $inscriptions = $inscriptions->get();
        foreach ($inscriptions as $inscrit) {
           $montantverse = Versement::where("inscription_id","=",$inscrit->id)
           ->where("annee_id","=",$inscrit->annee_id)->sum("montant");
        //    $montantverse = Versement::where("eleve_id","=",$inscrit->eleve_id)->sum("montant");
           $scolarite = Scolarite::where("classe_id","=",$inscrit->classe_id)
                                        ->where("annee_id","=",$inscrit->annee_id)
                                        ->where("serie","=",$inscrit->serie)->first();
        
           $inscrit['montantverse'] = $montantverse;
           $inscrit['scolarite'] = $scolarite;
           $inscrit['nom'] = $inscrit->eleve->nom;
           $inscrit['prenom'] = $inscrit->eleve->prenom;
           $inscrit['matricule'] = $inscrit->eleve->matricule;
           $inscrit['inscription_id'] = $inscrit->id; 
        }
        
        $inscriptions = json_decode(json_encode($inscriptions),true);
        usort($inscriptions, function($a, $b) {return strcmp($a['nom'].$a['prenom'], $b['nom'].$b['prenom']);});
        $inscriptions = json_decode(json_encode($inscriptions),false);

       return $inscriptions;
    }

    
    public function getVersementByAnneeOrAllGroupeByImpression(Request $request)
    {
        $inscriptions = Inscription::where("annee_id","=",$request->annee_id)->where("classe_id","=",$request->classe_id);
        if(isset($request->salle_classe_id)&&$request->salle_classe_id>0){
            $inscriptions->where('salle_classe_id','=', $request->salle_classe_id);
        }
        $inscriptions = $inscriptions->get();
        $i = 0;
        $anneescolaire=AnneeScolaire::find($request['annee_id'])->libelle;
        $salleclasse = SalleClasse::find($request['salle_classe_id'])->libelle;
        
        $scolaritetotale = 0;
        $scolaritetotaleversee = 0;
        $scolaritetotalerestante = 0;
        foreach ($inscriptions as $inscrit) {
            // $i = $i +1;
           $montantverse = Versement::where("inscription_id","=",$inscrit->id)
           ->where("annee_id","=",$inscrit->annee_id)->sum("montant");
           $scolarite = Scolarite::where("classe_id","=",$inscrit->classe_id)
                                        ->where("annee_id","=",$inscrit->annee_id)
                                        ->where("serie","=",$inscrit->serie)->first();
           $inscrit['montantverse'] = $montantverse;
           $inscrit['scolarite'] = $scolarite;
           $inscrit['nomprenom'] = $inscrit->eleve->nom." ".$inscrit->eleve->prenom; 
           $inscrit['matricule'] = $inscrit->eleve->matricule;
           $inscrit['inscription_id'] = $inscrit->id; 
           $inscrit['scolarite'] = ($inscrit->affecte =="NON"?$scolarite->frais_scolarite:$scolarite->frais_scolarite_affecte)+$scolarite->frais_inscription+$scolarite->autres_frais;
            $inscrit['etat'] = intval($montantverse)>=intval($inscrit['scolarite'])?"SOLDE":"NON SOLDE";
            $scolaritetotale = $scolaritetotale+$inscrit['scolarite'];
            $scolaritetotaleversee = $scolaritetotaleversee+$inscrit['montantverse'];
            // $inscrit['rank'] = $i;
        }
        $scolaritetotalerestante = $scolaritetotale - $scolaritetotaleversee;

        $inscriptions = json_decode(json_encode($inscriptions),true);
        usort($inscriptions, function($a, $b) {return strcmp($a['nomprenom'], $b['nomprenom']);});
        $i = 0;
        $inscriptions = json_decode(json_encode($inscriptions),false);
        foreach ($inscriptions as $inscrit) {
            $i = $i +1;
            $inscrit->rank = $i;
        }
        
        $TBS = new OpenTBS();
        $TBS->LoadTemplate('documents/ETAT_SCOLARITE_ELEVE_SALLE_CLASSE.docx',OPENTBS_ALREADY_UTF8);
        $TBS->MergeField('anneescolaire', $anneescolaire);
        $TBS->MergeField('salleclasse', $salleclasse);
        $TBS->MergeBlock('a', $inscriptions);
        $TBS->MergeField('scolaritetotale', number_format($scolaritetotale, 0, '.', ' '));
        $TBS->MergeField('scolaritetotaleversee', number_format($scolaritetotaleversee, 0, '.', ' '));
        $TBS->MergeField('scolaritetotalerestante', number_format($scolaritetotalerestante, 0, '.', ' '));
       $TBS->Show(OPENTBS_DOWNLOAD, 'ETAT_'.strtoupper($salleclasse).'_'.$anneescolaire.'.docx');
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Versement  $scolarite
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Versement $versement)
    {
        $versement->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Versement  $versement
     * @return \Illuminate\Http\Response
     */
    public function destroy(Versement $versement)
    {
        $versement->delete();
    }
    
    public function cancelle(Request $request)
    {
        $versement = Versement::find($request->id);
        return $versement->update(["cancelled_at"=>now(),"motif"=>$request->motif]);
    }

    public function restore(Request $request)
    {
        $versement = Versement::find($request->id);
        return $versement->update(["cancelled_at"=>null,"motif"=>null]);
    }
    
}
