import { Injectable } from '@angular/core';
import { Media } from 'app/models/media.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class MediaService {
    constructor(private apiService: ApiService) {}

    getAll(): Observable<any[]> {
      return this.apiService.get('api/media');
    }

    delete(media: Media): Observable<any> {
        return this.apiService.delete('api/media/' + media.id);
    }

    getMediaByTypeAndId(data: {type_documents,parent_id}): Observable<any[]> {
        return this.apiService.post('api/media/getMediaByTypeAndId', data);
    }
    

    // add(media: Media): Observable<Media> {
    //     return this.apiService.post('api/media', media);
    // }
    add(media: Media, doc: File): Observable<any>
    {    
        let file: File = doc;
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        formData.append('media', JSON.stringify(media));
        let headers = new Headers();
        /** In Angular 5, including the header Content-Type can invalidate your request */
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json'); 

        return this.apiService.post3('api/media',formData,{ headers: headers });

    }

    update(media: Media): Observable<Media> {
        return this.apiService.put('api/media/' + media.id, media);
    }

    get(id): Observable<Media> {
        return this.apiService.get('api/media/' + id);
    }

    getDocument(id): Observable<Media> {
        return this.apiService.get2('api/media/getDocument/' + id);
    }
}
