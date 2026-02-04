import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilisateurService } from 'app/core/services/utilisateur.service';
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/models/utilisateur.model';

@Component({
    selector: 'app-profil-password',
    templateUrl: './profil-password.component.html',
    styleUrls: ['./profil-password.component.scss'],
})
export class ProfilPasswordComponent implements OnInit {
    @Input() name;

    user: Utilisateur;

    formFieldHelpers: string[] = [''];
    constructor(
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public matDialogRef: MatDialogRef<ProfilPasswordComponent>,
        private _userService: UserService
    ) {
        this.user = new Utilisateur(_data.user);
        this.utilisateurForm = this.createUtilisateurForm();
    }
    existingEmail: { value: boolean } = { value: false };
    utilisateurForm: FormGroup;

    ngOnInit(): void {}
    /**
     * Create user form
     *
     * @returns {FormGroup}
     */

    createUtilisateurForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.user.id],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
            ],
            password_confirmation: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
            ],
            email: [
                { value: this.user.email, disabled: true }
            ],
        });
    }

    onSubmit() {
        let user:any = {password:this.utilisateurForm.get('password').value,modifiemotdepasse:true};
        this._userService
            .update(user)
            .subscribe((data) => {
                this.matDialogRef.close(this.utilisateurForm);
            });
    }
}
