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

    public function getAvatar($abonne_id){
        $abonne = Abonne::find($abonne_id);
        return response()->file('..\storage\app\public\uploads\\PERSONNEL\\'.$abonne->file_name);
    }
    public function removeAvatar($abonne_id){
        $abonne = Abonne::find($abonne_id);

        if($abonne->file_name!=null&&file_exists(storage_path('..\storage\app\public\uploads\\PERSONNEL\\'.$abonne->file_name)))
        unlink(storage_path('..\storage\app\public\uploads\\PERSONNEL\\'.$abonne->file_name));
        $abonne->file_name = null;
        $abonne->update();
        return $abonne;
    }
    
}