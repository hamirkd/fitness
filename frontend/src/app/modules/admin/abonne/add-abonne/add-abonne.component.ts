import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbonneService } from 'app/core/services/abonne.service';
import { Abonne } from 'app/models/abonne.model';

@Component({
    selector: 'app-add-abonne',
    templateUrl: './add-abonne.component.html',
    styleUrls: ['./add-abonne.component.scss'],
})
export class AddAbonneComponent implements OnInit {
    @Input() name;

    abonne: Abonne;
    action: 'edit' | 'new' = 'new';

    formFieldHelpers: string[] = [''];
    precision: number = 0;
    constructor(
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public matDialogRef: MatDialogRef<AddAbonneComponent>,private _snackBar: MatSnackBar,
        public abonneService: AbonneService
    ) {
        this.abonne = new Abonne(_data.abonne);
        this.action = _data.action;
        this.abonneForm = this.createAbonneForm();
    }
    abonneForm: FormGroup;

    ngOnInit(): void {
    }
    /**
     * Create user form
     *
     * @returns {FormGroup}
     */

    createAbonneForm(): FormGroup {
        return this._formBuilder.group({
        id:[this.abonne.id],
        nom:[this.abonne.nom],
        prenom:[this.abonne.prenom],
        datenais:[this.abonne.datenais],
        genre:[this.abonne.genre],
        telephone:[this.abonne.telephone],
        email:[this.abonne.email],
        observation:[this.abonne.observation],
        cnib:[this.abonne.cnib],
        lieunais:[this.abonne.lieunais],
    });
    }

    onSubmit() {
        let abonne = new Abonne(this.abonneForm.getRawValue());
       
        if (this.action == 'new') {
            this.abonneService.add(abonne).subscribe(
                (data) => {
                    
                this._snackBar.open('Vos données ont été sauvegardées', 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration:2000
                });
                    this.matDialogRef.close(this.abonneForm);
                },
                (err) => {
                    console.log(err);
                    this._snackBar.open('Une erreur intervenue', 'Splash', {
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                      duration:2000
                    });
                }
            );
        } else {
            console.log(abonne);
            this.abonneService
                .update(abonne)
                .subscribe((data) => {
                    this._snackBar.open('Vos données ont été sauvegardées', 'Splash', {
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                      duration:2000
                    });
                    this.matDialogRef.close(this.abonneForm);
                },err=>{
                    
      this._snackBar.open('Une erreur intervenue', 'Splash', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration:2000
      });
                });
        }
    }
    getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              this.abonneForm.get('latitude').setValue(position.coords.latitude);
              this.abonneForm.get('longitude').setValue(position.coords.longitude);
            //   this.longitude = position.coords.longitude;
            //   this.locationFetched = true;
            this.precision = position.coords.accuracy;
            },
            error => {
              console.error('Erreur de géolocalisation :', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          alert("La géolocalisation n'est pas supportée.");
        }
      }
      openInGoogleMaps() {
        const lat = this.abonneForm.get('latitude')?.value;
        const lng = this.abonneForm.get('longitude')?.value;
      
        if (lat && lng) {
          const url = `https://www.google.com/maps?q=${lat},${lng}`;
          window.open(url, '_blank'); // ← Ouvre dans un nouvel onglet
        } else {
          alert("Les coordonnées ne sont pas disponibles.");
        }
      }
}
