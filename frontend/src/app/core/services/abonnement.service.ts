import { Injectable } from '@angular/core';
import { Abonnement } from 'app/models/abonnement.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AbonnementService {

  constructor(private apiService: ApiService) {}

  getAlls(): Observable<any> {
    return this.apiService.get('api/abonnement');
  }

  get(id):Observable<Abonnement>{
    return this.apiService.get('api/abonnement/'+id);
  }

  add(abonnement: Abonnement): Observable<{abonnement:Abonnement, message: string}> {
      return this.apiService.post('api/abonnement', abonnement);
  }

  addMost(abonnements: Abonnement[]): Observable<any> {
      return this.apiService.post('api/abonnement/addMost', {abonnements});
  }

  update(abonnement: Abonnement): Observable<Abonnement> {
      return this.apiService.put('api/abonnement/'+abonnement.id , abonnement);
  }
  
  delete(abonnement: Abonnement): Observable<any> {
      return this.apiService.delete('api/abonnement/' + abonnement.id);
  }
  
  findBy(data):Observable<Abonnement[]>{
    return this.apiService.post('api/abonnement/findBy', data);
  }
  
  findByNouvelleAbonnement(data):Observable<Abonnement[]>{
    return this.apiService.post('api/abonnement/nouvelle', data);
  }
  
  
    cancelle(data:{id,motif}):Observable<any>{ 
      return this.apiService.post('api/abonnement/cancelle',data);
    }
    restore(data:{id}):Observable<any>{ 
      return this.apiService.post('api/abonnement/restore',data);
    }
    paye(data:{id}):Observable<any>{ 
      return this.apiService.post('api/abonnement/paye',data);
    }
    
    imprimerAbonnement(search): Observable<Blob | MediaSource> {
      return this.apiService.post2('api/abonnement/imprimer', search);
    }

}