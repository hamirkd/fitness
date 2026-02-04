import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilisateurService } from 'app/core/services/utilisateur.service'; 
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/models/utilisateur.model';
 
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit  {
  @Input() name;

  user: Utilisateur;

  formFieldHelpers: string[] = [''];
  constructor(
      private _formBuilder: FormBuilder,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      public matDialogRef: MatDialogRef<ProfilComponent>,
      private _utilisateurService:UtilisateurService,
      private _userService:UserService
  ) { 
      this.user = new Utilisateur(_data.user);
      this.utilisateurForm = this.createUtilisateurForm();
  }
  existingEmail:{value:boolean}={value:false}
  utilisateurForm: FormGroup;

  ngOnInit(): void {
 
  }
  /**
   * Create user form
   *
   * @returns {FormGroup}
   */

  createUtilisateurForm(): FormGroup {
      return this._formBuilder.group({
          id: [this.user.id],
          first_name     : [this.user.first_name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
          last_name     : [this.user.last_name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
          telephone     : [this.user.telephone, [Validators.required, Validators.minLength(4), Validators.maxLength(18)]],
           email     : [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(100)]]});
  }
   
  onSubmit() {    
        this._userService.update(this.utilisateurForm.getRawValue()).subscribe(data=>{
            console.log(data);
            this.matDialogRef.close(this.utilisateurForm);
        })
    
    
}
}
