<?php

namespace App\Http\Controllers;

use App\Models\Tarif;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TarifController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Tarif::all();
    }

 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(isset($request['id']) && $request['id']>0){
            $tarif = Tarif::find($request['id']);
            $tarif->update(MyFunction::audit($request->all()));
            return response()->json([
                'message' => "Le tarif a été mise à jour",
                'status' => 200
            ], 200);
        }
        else {
            $tarif = Tarif::where('code', '=', $request['code'])->get();
            if (count($tarif)>0) {
                return response()->json([
                    'message' => "Un tarif de ce code a déjà été enregistré",
                    'status' => 409,
                    'tarif' => $tarif
                ], 409);
            }
            Tarif::create(MyFunction::audit($request->all()));
        }
        return response()->json([
            'message' => 'Ajout d\'un tarif',
            'status' => 200
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Tarif  $tarif
     * @return \Illuminate\Http\Response
     */
    public function show(Tarif $tarif)
    {
        return $tarif;
    } 

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tarif  $tarif
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tarif $tarif)
    {
        $tarif->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tarif  $tarif
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tarif $tarif)
    {
        $tarif->delete();
    }
    
}
