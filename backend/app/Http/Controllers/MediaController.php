<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Media::all();
    }
 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $media = json_decode($request->media,true);
        // return $media;
        $request->validate([
            'uploadFile' => 'required|mimes:jpeg,jpg,png,xls,pdf|max:10048'
            ]);
            
            if($request->file()) {
                $fileName = time().'.'.$request->uploadFile->extension();
                $filePath = $request->file('uploadFile')->storeAs('uploads/'.$media['type_documents'], $fileName, 'public');
                $media['file_name'] = $fileName;
                Media::create($media);
            }
        
        return response()->json([
            'message' => 'Une nouvelle media a été ajoutée',
            'status' => 200
        ], 200);
    }

    

    public function getDocument($id){
        $media = Media::find($id);
        return response()->file('..\storage\app\public\uploads\\'.$media->type_documents.'\\'.$media->file_name);
    }

    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getMediaByTypeAndId(Request $request)
    {
        return Media::where("type_documents","=", $request->type_documents)
        ->where("parent_id","=", $request->parent_id)->get();
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function show(Media $media)
    {
        return $media;
    } 


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Media $media)
    {
        $media->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function destroy($media_id)
    {
        $media = Media::find($media_id);
        return $media->delete();
    }

}
