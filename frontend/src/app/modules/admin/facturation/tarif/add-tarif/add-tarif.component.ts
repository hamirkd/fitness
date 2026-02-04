import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TarifService } from 'app/core/services/tarif.service';
import { Tarif } from 'app/models/tarif.model';

@Component({
    selector: 'app-add-tarif',
    templateUrl: './add-tarif.component.html',
    styleUrls: ['./add-tarif.component.scss'],
})
export class AddTarifComponent implements OnInit {
    @Input() name;

    tarif: Tarif;
    action: 'edit' | 'new' = 'new';

    formFieldHelpers: string[] = [''];
    constructor(
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public matDialogRef: MatDialogRef<AddTarifComponent>,
        public tarifService: TarifService,
        private _snackBar: MatSnackBar
    ) {
        this.tarif = new Tarif(_data.tarif);
        this.action = _data.action;
        this.tarifForm = this.createTarifForm();
    }
    tarifForm: any;

    ngOnInit(): void {

    }
    /**
     * Create user form
     *
     * @returns {FormGroup}
     */

    createTarifForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.tarif.id],
            typetarif: [this.tarif.typetarif],
            montant: [this.tarif.montant],
            redevance: [this.tarif.redevance],
            autres_frais: [this.tarif.autres_frais],
        });
    }
    
    onSubmit() {

        let tarif = this.tarifForm.getRawValue();
        this.tarifService.add(tarif).subscribe(data=>{
            this.matDialogRef.close(this.tarifForm);
            this._snackBar.open(data.message, 'Splash', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration:2000
            });
        },err=>{
          console.log(err)
          this._snackBar.open(err.error.message, 'Splash', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration:2000,
            
          });
        })
      
      
  }
}
