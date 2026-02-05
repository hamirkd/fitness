<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QRCodeController;

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
// Route::get('web/qr-code', [QRCodeController::class, 'index']);
Route::group([
    'prefix' => 'web'
], function ($router) {
    Route::get('qr-code', [QRCodeController::class, 'index']);
});