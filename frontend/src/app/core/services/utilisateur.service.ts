import { Injectable } from '@angular/core';
import { Utilisateur } from 'app/models/utilisateur.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class UtilisateurService {
    constructor(private apiService: ApiService) {}

    getAll(): Observable<Utilisateur[]> {
        return this.apiService.get('api/utilisateur/find/noadmin');
    }

    getAllForAdmin(): Observable<Utilisateur[]> {
        return this.apiService.get('api/utilisateur/find/all');
    }

    get(id): Observable<Utilisateur> {
        return this.apiService.get('api/utilisateur/' + id);
    }

    add(utilisateur: Utilisateur): Observable<Utilisateur> {
        return this.apiService.post('api/utilisateur', utilisateur);
    }

    update(utilisateur: Utilisateur): Observable<Utilisateur> {
        return this.apiService.put('api/utilisateur/' + utilisateur.id, utilisateur);
    }

    delete(utilisateur: Utilisateur): Observable<any> {
        return this.apiService.delete('api/utilisateur/' + utilisateur.id);
    }
    restore(utilisateur: Utilisateur): Observable<any> {
        return this.apiService.get('api/utilisateur/restore/' + utilisateur.id);
    }
    passeWord(utilisateur: Utilisateur): Observable<any> {
        return this.apiService.get('api/utilisateur/passeWord/' + utilisateur.id);
    }
}
