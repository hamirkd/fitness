import { Injectable } from '@angular/core';
import { Abonne } from 'app/models/abonne.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AbonneService {

  constructor(private apiService: ApiService) {}

  getAlls(): Observable<any> {
    return this.apiService.get('api/abonne');
  }

  get(id):Observable<Abonne>{
    return this.apiService.get('api/abonne/'+id);
  }

  add(abonne: Abonne): Observable<Abonne> {
      return this.apiService.post('api/abonne', abonne);
  }

  update(abonne: Abonne): Observable<Abonne> {
      return this.apiService.put('api/abonne/'+abonne.id , abonne);
  }
  
  delete(abonne: Abonne): Observable<any> {
      return this.apiService.delete('api/abonne/' + abonne.id);
  }
    
  removeAvatar(abonne_id): Observable<any>
  {    
      return this.apiService.get('api/abonne/removeAvatar/'+abonne_id);
  }
  
  uploadAvatar(abonne_id: string, avatar: File): Observable<any>
  {    
      let file: File = avatar;
      let formData:FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      formData.append('abonne_id', abonne_id);
      let headers = new Headers();
      /** In Angular 5, including the header Content-Type can invalidate your request */
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json'); 

      return this.apiService.post3('api/abonne/uploadAvatar',formData,{ headers: headers });
  }
  getSvg() {
    return this.apiService.get3('web/qr-code');
  }

}