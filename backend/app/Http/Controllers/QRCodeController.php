<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
// https://www.itsolutionstuff.com/post/laravel-12-generate-qr-code-example-tutorialexample.html
class QRCodeController extends Controller
{
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function index(Request $request)
    {
       //return QrCode::SMS('121-222-6666', 'Body of the message');

        return QrCode::size(300)->generate(uniqid());
        // $image = QrCode::format('png')
        //                  ->merge(public_path('images/logo.png'), 0.5, true)
        //                  ->size(500)
        //                  ->errorCorrection('H')
        //                  ->generate(uniqid());
  
        // return response($image)->header('Content-type','image/png');
    }
}