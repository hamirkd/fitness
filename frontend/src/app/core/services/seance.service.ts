import { Injectable } from '@angular/core';
import { Seance } from 'app/models/seance.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class SeanceService {
    constructor(private apiService: ApiService) {}

    getAll(): Observable<any[]> {
      return this.apiService.get('api/seance');
    }

    delete(seance: Seance): Observable<any> {
        return this.apiService.delete('api/seance/' + seance.id);
    }

    add(seance: Seance): Observable<any> {
        return this.apiService.post('api/seance', seance);
    }

    update(seance: Seance): Observable<any> {
        return this.apiService.put('api/seance/' + seance.id, seance);
    }

    get(id): Observable<Seance> {
        return this.apiService.get('api/seance/' + id);
    }
    participer(telephone) : Observable<Seance> {
        return this.apiService.post('web/participe-seance', {telephone: telephone});
    }
}
