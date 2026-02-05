import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    constructor( private _httpClient: HttpClient){
    }
    post(url:string, data:any): Observable<any>{
      
      return this._httpClient.post(environment.urlApi+url,data);
    }
    
    put(url:string, data:any): Observable<any>{
      
      return this._httpClient.put(environment.urlApi+url,data);
    }
    get(url:string): Observable<any>{
      return this._httpClient.get(environment.urlApi+url);
    }
    get2(url:string): Observable<any>{
      return this._httpClient.get(environment.urlApi+url,{responseType: 'blob',reportProgress:true});
    }
    get3(url:string): Observable<any>{
      return this._httpClient.get(environment.urlApi+url,{responseType: 'text'});
    }

    delete(url:string): Observable<any>{
      return this._httpClient.delete(environment.urlApi+url);
    }
    
    post2(url:string, data:any): Observable<any>{
      console.log(url)
      return this._httpClient.post(environment.urlApi+url,data,{responseType: 'blob',reportProgress:true});
    }
    
    post3(url:string, data:any,options): Observable<any>{
      console.log(url)
      return this._httpClient.post(environment.urlApi+url,data,options);
    }
    
    getUrlTo(url:string): string{
      return environment.urlApi+url+'?token='+ (localStorage.getItem('accessToken') ?? '');
    }

}
