import { Injectable } from '@angular/core';
import { Tarif } from 'app/models/tarif.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class TarifService {
    constructor(private apiService: ApiService) {}

    getAll(): Observable<any[]> {
      return this.apiService.get('api/tarif');
    }

    delete(tarif: Tarif): Observable<any> {
        return this.apiService.delete('api/tarif/' + tarif.id);
    }

    add(tarif: Tarif): Observable<any> {
        return this.apiService.post('api/tarif', tarif);
    }

    update(tarif: Tarif): Observable<any> {
        return this.apiService.put('api/tarif/' + tarif.id, tarif);
    }

    get(id): Observable<Tarif> {
        return this.apiService.get('api/tarif/' + id);
    }
}
