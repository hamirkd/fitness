<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;


/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('caisse.{caissiereId}', function ($user, $caissiereId) {
    return (int) $user->id === (int) $caissiereId;
});
// Le nom du canal sans le préfixe "private-"
Broadcast::channel('fitness-checkin', function ($user) {
    // Vérifie si l'utilisateur a le droit d'écouter ce canal
    // Par exemple, vérifier si c'est une caissière ou un admin
    // return $user->role === 'caissiere' || $user->role === 'admin';
    Log::info('Tentative d\'accès au canal fitness-checkin', [
        'user_id' => $user ? $user->id : null,
        'user_role' => $user ? $user->role : null,
        'authenticated' => auth()->check(),
        'guard' => auth()->getDefaultDriver()
    ]);
    return true;
});
// Broadcast::channel('fitness-checkin', function ($user) {
//     return $user !== null;
// }, ['guards' => ['api']]);