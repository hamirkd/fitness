import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;
@Injectable({
  providedIn: 'root'
})
export class EchoService {
  echo: any;

  init(caissiereId: number|string) {
    console.log(localStorage.getItem('accessToken'))
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusherKey,
      cluster: environment.pusherCluster,
      forceTLS: true,
      authEndpoint: environment.urlApi + 'api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    });
      // Vérifier la connexion
      this.checkConnection();
  }

  private checkConnection() {
    if (this.echo && this.echo.connector && this.echo.connector.pusher) {
      this.echo.connector.pusher.connection.bind('connected', () => {
        console.log('✅ Connecté à Pusher');
      });

      this.echo.connector.pusher.connection.bind('error', (error: any) => {
        console.error('❌ Erreur Pusher:', error);
      });
    }
  }
}