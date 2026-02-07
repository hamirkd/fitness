<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController; 
use App\Http\Controllers\TarifController;
use App\Http\Controllers\VersementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/password-forget', [PasswordResetController::class, 'generate_password_init_token']);
Route::post('/password-verify', [PasswordResetController::class, 'verif_token_enabled_to_init_password']);
Route::post('/password-init', [PasswordResetController::class, 'reset_password_init']);
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/findAllUser',[AuthController::class,'findAllUser']);
    Route::delete('/deleteUser/{user}',[AuthController::class,'deleteUser']);
    Route::get('/bloquerUser/{user}',[AuthController::class,'bloquerUser']);
    
    Route::get('/userProfile',[AuthController::class,'userProfile']);
    Route::post('/updateMyProfile',[AuthController::class,'updateMyProfile']);
    Route::post('/uploadAvatar',[AuthController::class,'uploadAvatar']);
    Route::get('/getAvatar',[AuthController::class,'getAvatar']);
    Route::get('/removeAvatar',[AuthController::class,'removeAvatar']);
});


Route::middleware('auth:api')->group(function() { 
    Route::apiResource('tarif', 'App\Http\Controllers\TarifController');
    
    
    Route::apiResource('abonnement', 'App\Http\Controllers\AbonnementController');
    Route::post('abonnement/restore', 'App\Http\Controllers\AbonnementController@restore');
    Route::post('abonnement/cancelle', 'App\Http\Controllers\AbonnementController@cancelle');
    Route::post('abonnement/nouvelle', 'App\Http\Controllers\AbonnementController@nouvelle');
    Route::post('abonnement/findBy', 'App\Http\Controllers\AbonnementController@findBy');
    Route::post('abonnement/addMost', 'App\Http\Controllers\AbonnementController@addMost');
    Route::post('abonnement/imprimer', 'App\Http\Controllers\AbonnementController@imprimer');
    Route::post('abonnement/paye', 'App\Http\Controllers\AbonnementController@paye');
    
    Route::post('abonne/uploadAvatar', 'App\Http\Controllers\AbonneController@uploadAvatar');
    Route::get('abonne/removeAvatar/{abonne_id}', 'App\Http\Controllers\AbonneController@removeAvatar');
    Route::get('abonne/getAvatar/{abonne_id}', 'App\Http\Controllers\AbonneController@getAvatar');
    Route::apiResource('abonne', 'App\Http\Controllers\AbonneController');

    Route::apiResource('media', 'App\Http\Controllers\MediaController');
    Route::post('media/getMediaByTypeAndId', 'App\Http\Controllers\MediaController@getMediaByTypeAndId');
    Route::get('media/getDocument/{id}', 'App\Http\Controllers\MediaController@getDocument');

    Route::apiResource('utilisateur', 'App\Http\Controllers\AuthController');
    Route::get('utilisateur/find/noadmin', 'App\Http\Controllers\UtilisateurController@index');
    Route::get('utilisateur/find/all', 'App\Http\Controllers\UtilisateurController@findAll');
    Route::get('utilisateur/restore/{id}', 'App\Http\Controllers\UtilisateurController@restore');
    Route::get('utilisateur/passeWord/{id}', 'App\Http\Controllers\UtilisateurController@passeWord');

});