<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Client::orderBy('nom','ASC')->orderBy('prenom','ASC')->get();
    }
 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Client::create(MyFunction::audit($request->all()));
        return response()->json([
            'message' => 'Un nouveau client a été ajoutée',
            'status' => 200
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function show(Client $client)
    {
        return $client;
    } 


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Client $client)
    {
        $client->update(MyFunction::audit($request->all()));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function destroy(Client $client)
    {
        $client->delete();
    }

    
    public function uploadAvatar(Request $request){
        $client = Client::find($request->client_id);
        $request->validate([
            'uploadFile' => 'required|mimes:jpeg,jpg,png,xls,pdf|max:10048'
            ]);
            if($request->file()) {
                $fileName = time().'.'.$request->uploadFile->extension();
                $filePath = $request->file('uploadFile')->storeAs('uploads/PERSONNEL', $fileName, 'public');
                $client->file_name = $fileName;
                $this->removeAvatar($request->client_id);
                $client->update();
            }
        
        return $client;
    }

    public function getAvatar($client_id){
        $client = Client::find($client_id);
        return response()->file('..\storage\app\public\uploads\\PERSONNEL\\'.$client->file_name);
    }
    public function removeAvatar($client_id){
        $client = Client::find($client_id);

        if($client->file_name!=null&&file_exists(storage_path('..\storage\app\public\uploads\\PERSONNEL\\'.$client->file_name)))
        unlink(storage_path('..\storage\app\public\uploads\\PERSONNEL\\'.$client->file_name));
        $client->file_name = null;
        $client->update();
        return $client;
    }
    
}