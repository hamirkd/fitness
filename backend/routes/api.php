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
    Route::apiResource('versements', 'App\Http\Controllers\VersementController');
    Route::post('versements/getByAnneeInscription', [VersementController::class,'getByAnneeInscription']);
    Route::post('versements/getEleveDetailVersementByAnneeAndEleve', [VersementController::class,'getEleveDetailVersementByAnneeAndEleve']);
    Route::post('versements/getVersementByAnneeOrAll', [VersementController::class,'getVersementByAnneeOrAll']);
    Route::post('versements/getVersementByAnneeOrAllGroupeBy', [VersementController::class,'getVersementByAnneeOrAllGroupeBy']);
    Route::post('versements/getVersementByAnneeOrAllGroupeByImpression', [VersementController::class,'getVersementByAnneeOrAllGroupeByImpression']);
    Route::post('versements/cancelle', [VersementController::class,'cancelle']);
    Route::post('versements/restore', [VersementController::class,'restore']);
    
    Route::post('facture/restore', 'App\Http\Controllers\FactureController@restore');
    Route::post('facture/cancelle', 'App\Http\Controllers\FactureController@cancelle');
    Route::post('facture/nouvelle', 'App\Http\Controllers\FactureController@nouvelle');
    Route::post('facture/findBy', 'App\Http\Controllers\FactureController@findBy');
    Route::post('facture/addMost', 'App\Http\Controllers\FactureController@addMost');
    Route::post('facture/imprimer', 'App\Http\Controllers\FactureController@imprimer');
    Route::post('facture/paye', 'App\Http\Controllers\FactureController@paye');
    
    Route::apiResource('facture', 'App\Http\Controllers\FactureController');
    
    Route::post('client/uploadAvatar', 'App\Http\Controllers\ClientController@uploadAvatar');
    Route::get('client/removeAvatar/{client_id}', 'App\Http\Controllers\ClientController@removeAvatar');
    Route::get('client/getAvatar/{client_id}', 'App\Http\Controllers\ClientController@getAvatar');
    Route::apiResource('client', 'App\Http\Controllers\ClientController');

    Route::apiResource('media', 'App\Http\Controllers\MediaController');
    Route::post('media/getMediaByTypeAndId', 'App\Http\Controllers\MediaController@getMediaByTypeAndId');
    Route::get('media/getDocument/{id}', 'App\Http\Controllers\MediaController@getDocument');

    Route::apiResource('utilisateur', 'App\Http\Controllers\AuthController');
    Route::get('utilisateur/find/noadmin', 'App\Http\Controllers\UtilisateurController@index');
    Route::get('utilisateur/find/all', 'App\Http\Controllers\UtilisateurController@findAll');
    Route::get('utilisateur/restore/{id}', 'App\Http\Controllers\UtilisateurController@restore');
    Route::get('utilisateur/passeWord/{id}', 'App\Http\Controllers\UtilisateurController@passeWord');

});