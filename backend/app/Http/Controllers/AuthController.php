<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\PasswordReset;
use Validator;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register','password-forget','password-init','password-verify','findAllUser','getAvatar']]);
    }
    
    public function findAllUser(){
        
        $users = User::all();
        return $users->where("supprimer",false);
    }
    
    public function deleteUser(Request $request,User $user)
    {
        $user->supprimer=true;
        $user->update();
    }
    
    public function bloquerUser(Request $request,User $user)
    {
        $user->bloquer=!$user->bloquer;
        $user->update();
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->createNewToken($token);
    }
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

        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));
        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user,
            "status"=>201
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Donnee  $donnee
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);
        $user->delete();
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
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

        $user = User::create(array_merge(
                    $request->all(),
                    ['password' => bcrypt($request->password)]
                ));
        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user,
            "status"=>201
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateMyProfile(Request $request)
    {
        // les valeurs qui peuvent etre modifier
         
         $user = Auth::user();
        //  $user = User::find($user->id);
         if(isset($request->first_name)){
            $user->first_name=$request->first_name;
            $user->last_name=$request->last_name;
            $user->telephone=$request->telephone;
            // $user->role=$request->role;
            $user->update();
        }
        
        if(isset($request->modifiemotdepasse)&&$request->modifiemotdepasse){
            $user = Auth::user();
            $user->password = bcrypt($request->password);
            $user->update();
        }
        return response()->json([
            'message' => 'User updated',
            'user' => $user
        ], 201);
    }

    public function uploadAvatar(Request $request){

        $request->validate([
            'uploadFile' => 'required|mimes:jpeg,jpg,png,xls,pdf|max:2048'
            ]);
            $user = Auth::user();
            if($request->file()) {
                $this->removeAvatar();
                $fileName = time().'.'.$request->uploadFile->extension();
                $filePath = $request->file('uploadFile')->storeAs('uploads/PROFIL', $fileName, 'public');
                $user->avatar = $fileName;
                $user->save();
            }

        return Auth::user();
    }

    // public function getAvatar($avatar){
    //     return response()->file('..\storage\app\public\uploads\\PROFIL\\'.$avatar);
    // } 
    public function getAvatar(){
        $user = Auth::user();
        return response()->file('..\storage\app\public\uploads\\PROFIL\\'.$user->avatar);
    }
    
    public function removeAvatar(){
        $user = Auth::user();
        if($user->avatar!=null&&file_exists(storage_path('..\storage\app\public\uploads\\PROFIL\\'.$user->avatar)))
        unlink(storage_path('..\storage\app\public\uploads\\PROFIL\\'.$user->avatar));
        $user->avatar = null;
        $user->save();
        return Auth::user();
    }
    

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        // $user->update($request->all());
        $user = User::find($request['id']);
        // return response()->json([
        //     'message' => 'User updated',
        //     'user' => $user
        // ], 201);
        $user->first_name=$request->input('first_name');
        $user->last_name=$request->input('last_name');
        $user->telephone=$request->input('telephone');
        $user->email=$request->input('email');
        $user->role=$request->input('role');
        $user->personnel_id=$request->input('personnel_id');
        $user->update();
        // $user->update($request->all());
        return response()->json([
            'message' => 'User updated',
            'user' => $user
        ], 201);
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth()->user());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user(),
            "role"=>auth()->user()->role
        ]);
    }
    
    /**
     * Cette fonction permet de generer un token de reinitialisation
     * de mot de passe
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function generate_password_init_token(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        
        $email=$request->input('email');
        $user = User::all()->where('email',$email);
        if($user==null){
            return response()->json([
                'message' => 'User is not existed',
                'status' => 404
            ], 404);
        }
        PasswordReset::create(array_merge(
            $validator->validated(),
            ['token' => Str::random(99)]
        ));
        // Email pour envoyer le lien de reinitialisation
        
        return response()->json([
            'message' => 'A email will sending with the reinitilisation code',
            'status' => 200
        ], 200);
    }
    
    /**
     * Verif if token is enabled
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function verif_token_enabled_to_init_password(Request $request) {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string|between:2,100'
        ]);
        $token=$request->input('token');
        $passwordReset = PasswordReset::all()->where('token',$token);
        if($passwordReset==null){
            return response()->json([
                "message"=>"Bad token",
                "status"=>400
            ],400);
        }
        
        return response()->json([
            'message' => 'Good token',
            'email' => $passwordReset->email,
            "status"=>200
        ], 200);
    }

     /**
     * Init user password.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset_password_init(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed|min:6'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $user = User::all()->where('email',$request->email);
        $user->password = bcrypt($request->password);
        $user->save();
        $token=$request->input('token');
        PasswordReset::all()->where('token',$request->token)->delete();
        // Envoie un mail pour informer que le mot de passe a été changé
        return response()->json([
            'message' => 'Password is updated',
            "status"=>201
        ], 201);
    }
    
        public function email_bienvenue($nomprenom,$url){
return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="width:100%;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">

<head>
    <meta charset="iso-8859-1" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <title>Création de compte</title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <style type="text/css">
        @media only screen and (max-width:600px) {
            p,
            ul li,
            ol li,
            a {
                font-size: 16px !important;
                line-height: 150% !important
            }

            h1 {
                font-size: 30px !important;
                text-align: center;
                line-height: 120% !important
            }

            h2 {
                font-size: 26px !important;
                text-align: center;
                line-height: 120% !important
            }

            h3 {
                font-size: 20px !important;
                text-align: center;
                line-height: 120% !important
            }

            .es-menu td a {
                font-size: 16px !important
            }

            .es-header-body p,
            .es-header-body ul li,
            .es-header-body ol li,
            .es-header-body a {
                font-size: 16px !important
            }

            .es-footer-body p,
            .es-footer-body ul li,
            .es-footer-body ol li,
            .es-footer-body a {
                font-size: 16px !important
            }

            .es-infoblock p,
            .es-infoblock ul li,
            .es-infoblock ol li,
            .es-infoblock a {
                font-size: 12px !important
            }

            *[class="gmail-fix"] {
                display: none !important
            }

            .es-m-txt-c {
                text-align: center !important
            }

            .es-m-txt-r {
                text-align: right !important
            }

            .es-m-txt-l {
                text-align: left !important
            }

                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important
                }

            .es-button-border {
                display: block !important
            }

            a.es-button {
                font-size: 20px !important;
                display: block !important;
                border-width: 10px 0px 10px 0px !important
            }

            .es-btn-fw {
                border-width: 10px 0px !important;
                text-align: center !important
            }

            .es-adaptive table,
            .es-btn-fw,
            .es-btn-fw-brdr,
            .es-left,
            .es-right {
                width: 100% !important
            }

            .es-content table,
            .es-header table,
            .es-footer table,
            .es-content,
            .es-footer,
            .es-header {
                width: 100% !important;
                max-width: 600px !important
            }

            .es-adapt-td {
                display: block !important;
                width: 100% !important
            }

            .adapt-img {
                width: 100% !important;
                height: auto !important
            }

            .es-m-p0 {
                padding: 0px !important
            }

            .es-m-p0r {
                padding-right: 0px !important
            }

            .es-m-p0l {
                padding-left: 0px !important
            }

            .es-m-p0t {
                padding-top: 0px !important
            }

            .es-m-p0b {
                padding-bottom: 0 !important
            }

            .es-m-p20b {
                padding-bottom: 20px !important
            }

            .es-mobile-hidden,
            .es-hidden {
                display: none !important
            }

            .es-desk-hidden {
                display: table-row !important;
                width: auto !important;
                overflow: visible !important;
                float: none !important;
                max-height: inherit !important;
                line-height: inherit !important
            }

            .es-desk-menu-hidden {
                display: table-cell !important
            }

            table.es-table-not-adapt,
            .esd-block-html table {
                width: auto !important
            }

            table.es-social td {
                display: inline-block !important
            }

            table.es-social {
                display: inline-block !important
            }
        }

        #outlook a {
            padding: 0;
        }

        .ExternalClass {
            width: 100%;
        }

            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }

        .es-button {
            mso-style-priority: 100 !important;
            text-decoration: none !important;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        .es-desk-hidden {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
            mso-hide: all;
        }
    </style>
</head>

<body style="width:100%;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
    <div class="es-wrapper-color" style="background-color:#e6e6e6;">
        <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#cccccc"></v:fill>
            </v:background>
        <![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
            <tr style="border-collapse:collapse;">
                <td valign="top" style="padding:0;Margin:0;">
                    <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                        <tr style="border-collapse:collapse;">
                            <td class="es-adaptive" align="center" style="padding:0;Margin:0;">
                                <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;">
                                    <tr style="border-collapse:collapse;">
                                        <td style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:40px;padding-right:40px;background-color:#d2edff;" bgcolor="#d2edff" align="left">
                                            <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                <tr style="border-collapse:collapse;">
                                                    <td width="520" valign="top" align="left" style="padding:0;Margin:0;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td class="es-m-p0l" align="left" style="padding:0;Margin:0;">
                                                                    <h1 style="Margin:0;line-height:31px;mso-line-height-rule:exactly;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;font-size:22px;font-style:normal;font-weight:normal;color:#4A7EB0;">Création de compte</h1>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                        <tr style="border-collapse:collapse;">
                            <td align="center" style="padding:0;Margin:0;">
                                <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                    <tr style="border-collapse:collapse;">
                                        <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;">
                                            <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                <tr style="border-collapse:collapse;">
                                                    <td width="520" valign="top" align="center" style="padding:0;Margin:0;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:20px;">
                                                                    <table width="5%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;">
                                                                        <span style="font-size:14px;line-height:24px;">Bonjour '.$nomprenom.'</span><span style="font-size:14px;line-height:24px;">,</span>
                                                                        <br />
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" style="padding:0;Margin:0;">
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;">Vous avez créé un compte sur cpf-bf.com</p>
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;">
                                                                        <br />
                                                                    </p>
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;"><b>Veuillez cliquer sur le bouton ci-dessous pour activer votre compte.</b></p>
																	
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:14px;color:#666666;">
                                                                        <br />
                                                                    </p>
																	<table cellspacing="0" cellpadding="0"><tr><td>
																		<a href="'.$url.'" style="background:#13b5ea;border:12px solid #13b5ea;font-size:15px;text-align:center; text-decoration:none;display:block;border-radius:3px;">
																			&nbsp;&nbsp;&nbsp;
																			<span style="color:#FFFFFF">
																			Activer mon compte
																			</span>
																			&nbsp;&nbsp;&nbsp;
																		</a>
																	</td></tr></table>
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;">
                                                                        <br />
                                                                    </p>
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;"><i>Merci pour votre confiance.</i></p>
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;">
                                                                        <br />
                                                                    </p>
                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;line-height:21px;color:#666666;">A tr&egrave;s bient&ocirc;t sur PIVA !</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr style="border-collapse:collapse;">
                                        <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;">
                                            <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                <tr style="border-collapse:collapse;">
                                                    <td width="520" valign="top" align="center" style="padding:0;Margin:0;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="center" style="padding:0;Margin:0;padding-right:5px;padding-top:20px;padding-bottom:20px;">
                                                                    <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td style="padding:0;Margin:0px;border-bottom:1px solid #FFFFFF;background:rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height:1px;width:100%;margin:0px;"></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                        <tr style="border-collapse:collapse;">
                            <td class="es-adaptive" align="center" style="padding:0;margin:0;">
                                <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;">
                                    <tr style="border-collapse:collapse;">
                                        <td style="margin:0;padding-top:10px;padding-bottom:15px;background-color:#d2edff;" bgcolor="#d2edff" align="left">
                                            <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                <tr style="border-collapse:collapse;">
                                                    <td width="520" valign="top" align="left" style="padding:0;margin:0;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
																<td class="es-hidden" width="40" style="padding:0;margin:0;"></td>
                                                                <td align="left" style="padding:0;margin:0;">
                                                                    <a href="https://cpf-bf.com">
                                                                    <span style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica,
                                                                     \'helvetica neue\', arial, verdana, sans-serif;font-size:14px;;color:#333333;">
                                                                     <img src="https://cpf-bf.com/wp-content/uploads/2020/11/cropped-logobtc.png"
                                                                     alt="PIVA" title="PIVA" width="50" 
                                                                     style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" />
                                                                    </span>
                                                                </a>
                                                                </td>
                                                                
																<td class="" width="173" style="padding:0;margin:0;">
                                                                    <a href="https://web.facebook.com/piva">
                                                                    <span style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica,
                                                                     \'helvetica neue\', arial, verdana, sans-serif;font-size:14px;;color:#333333;">
                                                                     <img src="https://crc-canada.org/wp-content/uploads/2018/06/facebook-icon.png"
                                                                     alt="Facebook" title="Facebook" width="50" 
                                                                     style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" />
                                                                    </span></a>
                                                                </td>
                                                                <td class="es-m-txt-?" esdev-links-color="#666666" align="left" style="padding:0;margin:0;font-size:12px;line-height:16px;color:#123049;font-weight:bold;">
                                                                    Ouagadougou, Burkina Faso<br />
                                                                    Nonsin, Secteur 11<br />
                                                                    T&eacute;l&eacute;phone : 52 000 058
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
<img src="https://u13121802.ct.sendgrid.net/wf/open?upn=042JczSyiSaXIZh48RfbARuU4Hk23vO0iIO1mcw7LO3nkEL7IPD3F54sqXkZmOoGaqQyTKo2NSvfDogkEvvA9osSFZkONej7kjMI8C181r0C8kFwbWFqHH-2BOQD-2FjMcKSY1jEvwQetrdo6Ip2jLDooCNVzSGzAAXSJpxyMKAWJ7U6KjfZQoXXTlo-2BVyX-2FmyafyLpoCsZhD6xJfRF8a9v3rC1DHRwh2eawJphcFK63XeOuFXL9wLPRUk8NZwMpA3FWIhfDaubh91BACc-2BE2fV07ysbJUAzQAHl3HfAzfzOnph9Euvx2yFbumzHfnkF2T6Gor-2FagVV1ZPC2SRzvRa9bDw-3D-3D" alt="" width="1" height="1" border="0" style="height:1px !important;width:1px !important;border-width:0 !important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;padding-top:0 !important;padding-bottom:0 !important;padding-right:0 !important;padding-left:0 !important;"/></body>

</html>';
    }
    

}