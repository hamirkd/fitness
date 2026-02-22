<?php

namespace App\Http\Controllers;

use App\Models\Abonne;
use Illuminate\Http\Request;

class AbonneController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Abonne::orderBy('nom','ASC')->orderBy('prenom','ASC')->get();
    }
 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $abonne = Abonne::where('telephone', $request->telephone)
                ->orWhere('email', $request->email)
                ->first();
        if ($abonne) {
            return response()->json([
                'message' => "Ce numéro existe déjà pour l'abonné {$abonne->nom} {$abonne->prenom}",
                'status' => 400
            ], 400);
        }

        Abonne::create(MyFunction::audit($request->all()));
        return response()->json([
            'message' => 'Un nouveau abonné a été ajoutée',
            'status' => 200
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Abonne  $abonne
     * @return \Illuminate\Http\Response
     */
    public function show(Abonne $abonne)
    {
        return $abonne;
    } 


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Abonne  $abonne
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Abonne $abonne)
    {
        $abonne->update(MyFunction::audit($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Abonne  $abonne
     * @return \Illuminate\Http\Response
     */
    public function destroy(Abonne $abonne)
    {
        $abonne->delete();
    }

    
    public function uploadAvatar(Request $request){
        $abonne = Abonne::find($request->abonne_id);
        $request->validate([
            'uploadFile' => 'required|mimes:jpeg,jpg,png,xls,pdf|max:10048'
            ]);
            if($request->file()) {
                $fileName = time().'.'.$request->uploadFile->extension();
                $filePath = $request->file('uploadFile')->storeAs('uploads/PERSONNEL', $fileName, 'public');
                $abonne->file_name = $fileName;
                $this->removeAvatar($request->abonne_id);
                $abonne->update();
            }
        
        return $abonne;
    }

    public function getAvatar($abonne_id) {

        $abonne = Abonne::find($abonne_id);
        if (!$abonne) {
            return response()->json([
                'message' => 'Média introuvable'
            ], 404);
        }

        $path = 'uploads/PERSONNEL/' . $media->type_documents . '/' . $abonne->file_name;

        if (!Storage::disk('public')->exists($path)) {
            return response()->json([
                'message' => 'Fichier non trouvé sur le serveur'
            ], 404);
        }

        return Storage::disk('public')->response($path);
    }

    public function removeAvatar($abonne_id){

        $abonne = Abonne::find($abonne_id);

        if (!$abonne) {
            return response()->json([
                'message' => 'Média introuvable'
            ], 404);
        }

        $path = 'uploads/PERSONNEL/' . $abonne->file_name;

        // Supprimer le fichier s'il existe
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        $abonne->file_name = null;
        $abonne->update();
        return $abonne;
    }
    
}