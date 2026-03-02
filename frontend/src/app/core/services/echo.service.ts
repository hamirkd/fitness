import { environment } from 'environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export class EchoService {
    echo = new Echo({
        broadcaster: 'pusher',
        key: environment.pusherKey,
        cluster: environment.pusherCluster,
        forceTLS: false
    });
}