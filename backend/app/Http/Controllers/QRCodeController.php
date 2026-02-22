<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\Abonnement;
use App\Models\Abonne;
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
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'];
        $server_url = $protocol . '://' . $host . "/backend/public/index.php/web/qr-code/" .uniqid();
        $server_url = $protocol . '://' . $host . "/qr-code/participer/" .uniqid();

        return QrCode::size(400)->generate($server_url);
        // $image = QrCode::format('png')
        //                  ->merge(public_path('images/logo.png'), 0.5, true)
        //                  ->size(500)
        //                  ->errorCorrection('H')
        //                  ->generate(uniqid());
  
        // return response($image)->header('Content-type','image/png');
    }
    public function verifConnexion(Request $request){
        $today = Carbon::today();
        $tokenConnexion = $request->tokenConnexion;
        $telephone = $request->telephone;
        $today = now(); // ou date('Y-m-d')
        $abonnements = DB::table('fit_abonnements')
            ->leftJoin('abonnes', function($join) {
                $join->on('abonnes.id', '=', 'fit_abonnements.abonne_id')
                    ->whereNull('fit_abonnements.deleted_at')
                    ->whereNull('abonnes.deleted_at');
            })
            ->where('date_debut', '<=', $today)
            ->where('date_fin', '>=', $today)
            ->get();

        if ($abonnements->isNotEmpty()) {
            
        }
    }
}