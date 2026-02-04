<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\PasswordReset;
use Validator;

class UtilisateurController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Utilisateur::all();//->get();
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function findAll()
    {
        return Utilisateur::withTrashed()->get();
    }
 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    
    public function store(Request $request){
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
            'first_name' => 'required|string|between:2,100',
            'last_name' => 'required|string|between:2,100',
            'telephone' => 'required|string|between:4,18'
        ]); 

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = Utilisateur::create(array_merge(
                    $request->all(),
                    ['password' => bcrypt($request->password)]
                ));
        return response()->json([
            'message' => 'Utilisateur successfully registered',
            'user' => $user,
            "status"=>201
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Utilisateur  $utilisateur
     * @return \Illuminate\Http\Response
     */
    public function show(Utilisateur $utilisateur)
    {
        return $utilisateur;
    } 


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Utilisateur  $utilisateur
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Utilisateur $utilisateur)
    {
        return $utilisateur->update([
            "first_name"=>$request->first_name,
            "last_name"=>$request->last_name,
            "telephone"=>$request->telephone,
            "email"=>$request->email,
            "role"=>$request->role,
        ]);
        $utilisateur->update($request->all());
    }
    
  

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Utilisateur  $utilisateur
     * @return \Illuminate\Http\Response
     */
    public function destroy(Utilisateur $utilisateur)
    {
        $utilisateur->delete();
        // $model = Contents::find( $id );
        // $model->delete();
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Utilisateur  $utilisateur
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        Utilisateur::withTrashed()
        ->find($id)
        ->restore(); 
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Utilisateur  $utilisateur
     * @return \Illuminate\Http\Response
     */
    public function passeWord($id)
    {
        return Utilisateur::find($id)->update(['password' => bcrypt("Digital@2023")]);
         
    }
    
    
}
