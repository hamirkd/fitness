import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {FormControl} from '@angular/forms'; 
import { fuseAnimations } from '@fuse/animations';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Utilisateur } from 'app/models/utilisateur.model';
import { ProfilPasswordComponent } from './profil-password/profil-password.component';
import { ProfilComponent } from './profil/profil.component';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-mon-profil',
    templateUrl: './mon-profil.component.html',
    styleUrls: ['./mon-profil.component.scss'],
})
export class MonProfilComponent implements OnInit {
    @ViewChild('supportNgForm') supportNgForm: NgForm;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    urlForBackend=""
    alert: any;
    supportForm: FormGroup;
    user: Utilisateur = new Utilisateur({});
    dialogRef: any;
    editMode:boolean = false;
    userAvatarForm = new FormControl('');
    token
    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _userService: UserService,private _authService:AuthService
    ) {
        this.urlForBackend = environment.urlApi
        this.token = this._authService.accessToken
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.token = this._authService.accessToken
        // Create the support form
        this.supportForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required],
        });
        this._userService.get().subscribe((data) => {
            this.user = new Utilisateur(data);
        },err=>{console.log(err)});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Clear the form
     */
    clearForm(): void {
        // Reset the form
        this.supportNgForm.resetForm();
    }

    /**
     * Send the form
     */
    sendForm(): void {
        // Send your form here using an http request
        console.log('Your message has been sent!');

        // Show a success message (it can also be an error message)
        // and remove it after 5 seconds
        this.alert = {
            type: 'success',
            message:
                'Your request has been delivered! A member of our support staff will respond as soon as possible.',
        };

        setTimeout(() => {
            this.alert = null;
        }, 7000);

        // Clear the form
        this.clearForm();
    }
    editerPassword(): void {
        this.dialogRef = this._matDialog.open(ProfilPasswordComponent, {
            panelClass: '',
            data: {
                user: this.user
            },
        });

        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }

            this.ngOnInit();
        });
    }
    
    editer(): void {
        this.dialogRef = this._matDialog.open(ProfilComponent, {
            panelClass: '',
            data: {
                user: this.user
            },
        });

        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }

            this.ngOnInit();
        });
    }
    toggleEditMode(){
        this.editMode = !this.editMode;
    }
    
    /**
     * Remove the avatar
     */
     removeAvatar(): void
     {
         // Get the form control for 'avatar'
        //  const avatarFormControl = this.userAvatarForm.get('avatar');
 
        //  // Set the avatar as null
        //  avatarFormControl.setValue(null);
 
        //  // Set the file input value as null
        //  this._avatarFileInput.nativeElement.value = null;
 
         // Update the contact
         this.user.avatar = null;
         this._userService.removeAvatar().subscribe(data=>{
            this.user = data;
         })
     }
     
    uploadAvatar(fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        // Upload the avatar
        this._userService.uploadAvatar(this.user.id+"", file).subscribe(data=>{
            this.user = data
        });
    }
}
