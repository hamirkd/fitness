import { Injectable } from '@angular/core';
import { Client } from 'app/models/client.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private apiService: ApiService) {}

  getAlls(): Observable<any> {
    return this.apiService.get('api/client');
  }

  get(id):Observable<Client>{
    return this.apiService.get('api/client/'+id);
  }

  add(client: Client): Observable<Client> {
      return this.apiService.post('api/client', client);
  }

  update(client: Client): Observable<Client> {
      return this.apiService.put('api/client/'+client.id , client);
  }
  
  delete(client: Client): Observable<any> {
      return this.apiService.delete('api/client/' + client.id);
  }
    
  removeAvatar(client_id): Observable<any>
  {    
      return this.apiService.get('api/client/removeAvatar/'+client_id);
  }
  
  uploadAvatar(client_id: string, avatar: File): Observable<any>
  {    
      let file: File = avatar;
      let formData:FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      formData.append('client_id', client_id);
      let headers = new Headers();
      /** In Angular 5, including the header Content-Type can invalidate your request */
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json'); 

      return this.apiService.post3('api/client/uploadAvatar',formData,{ headers: headers });
  }

}