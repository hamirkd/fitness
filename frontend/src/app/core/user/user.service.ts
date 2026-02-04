import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable, ReplaySubject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { ApiService } from '../services/api.service';
import { map, tap } from 'rxjs/operators';
import { Utilisateur } from 'app/models/utilisateur.model';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private apiService: ApiService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this.apiService.get('api/auth/userProfile').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user 
     *
     * @param user
     */
    update(user: Utilisateur): Observable<any>
    {    
        return this.apiService.post('api/auth/updateMyProfile',user).pipe(
            tap((response) => {
                this._user.next(response);
            })
        );
    }

     
    uploadAvatar(id: string, avatar: File): Observable<any>
    {    
        let file: File = avatar;
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        let headers = new Headers();
        /** In Angular 5, including the header Content-Type can invalidate your request */
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json'); 

        return this.apiService.post3('api/auth/uploadAvatar',formData,{ headers: headers }).pipe(
            tap((response) => {
                this._user.next(response);
            })
        );
    }

    removeAvatar(): Observable<any>
    {    
        return this.apiService.get('api/auth/removeAvatar');
    }
}
