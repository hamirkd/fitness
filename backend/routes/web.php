<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TraitementsDasController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('site/index');
});
// Route::get('/login', function () {
//     return view('admin/admin-user/index');
// });
Route::get('/test', function () {
    $binance = new TraitementsDasController();
   $binance->test8();
});