<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class AbonneChecked implements ShouldBroadcast
{
    public $payload;
    private $caissierId;
    private $abonne;

    public function __construct($payload, ?int $caissierId = null) {
        $this->payload = $payload;
        $this->caissierId = $caissierId;
        $this->abonne = $payload['abonne'];
    }
    
    public function broadcastOn()
    {
        // Handle null caissierId - maybe broadcast to a general channel?
        // if ($this->caissierId === null) {
        //     // Option 1: Return a general channel
        //     return new PrivateChannel('fitness-checkin.all');
            
        //     // Option 2: Or don't broadcast at all
        //     // return new \Illuminate\Broadcasting\Channel('null-channel');
        // }
        
        // return new PrivateChannel('fitness-checkin/caissier.' . $this->caissierId);
        // return new PrivateChannel('fitness-checkin');
        return new PrivateChannel('fitness-checkin.'.$this->caissierId);
    }
    
    public function broadcastAs()
    {
        return 'abonne.checked';
    }
    public function broadcastWith()
    {
        return [
            'abonne' => [
                'id' => $this->abonne->id,
                'nom' => $this->abonne->nom,
                'prenom' => $this->abonne->prenom,
                'photo' => $this->abonne->photo
            ],
            'payload' => $this->payload,
            'timestamp' => now()->toDateTimeString()
        ];
    }
}