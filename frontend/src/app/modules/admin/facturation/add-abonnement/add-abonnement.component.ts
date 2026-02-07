import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbonneService } from 'app/core/services/abonne.service';
import { AbonnementService } from 'app/core/services/abonnement.service';
import { TarifService } from 'app/core/services/tarif.service';
import { Abonne } from 'app/models/abonne.model';
import { Abonnement } from 'app/models/abonnement.model';
import { Tarif } from 'app/models/tarif.model';

@Component({
    selector: 'app-add-abonnement',
    templateUrl: './add-abonnement.component.html',
    styleUrls: ['./add-abonnement.component.scss'],
})
export class AddAbonnementComponent implements OnInit {
    @Input() name;

    abonnement: Abonnement;
    action: 'edit' | 'new' = 'new';

    formFieldHelpers: string[] = [''];
    precision: number = 0;
    abonnes: Array<Abonne>;
    tarifs: Array<Tarif>;
    constructor(
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public matDialogRef: MatDialogRef<AddAbonnementComponent>,private _snackBar: MatSnackBar,
        public abonnementService: AbonnementService,
        public abonneService:AbonneService,
        public tarifService: TarifService
    ) {
        this.abonnement = new Abonnement(_data.abonnement);
        this.action = _data.action;
        this.abonnementForm = this.createAbonnementForm();
    }
    abonnementForm: FormGroup;

    ngOnInit(): void {
      this.abonneService.getAlls().subscribe(datas => {
        this.abonnes = datas;
      });
      
      this.tarifService.getAll().subscribe(datas => {
        this.tarifs = datas;
      });
      
    }
    /**
     * Create user form
     *
     * @returns {FormGroup}
     */

    createAbonnementForm(): FormGroup {
        return this._formBuilder.group({
        id:[this.abonnement.id],
        abonne_id:[this.abonnement.abonne_id],
        tarif_id:[this.abonnement.tarif_id],
    });
    }

    onSubmit() {
        let abonnement = new Abonnement(this.abonnementForm.getRawValue());
       
        if (this.action == 'new') {
            this.abonnementService.add(abonnement).subscribe(
                (data) => {
                    
                this._snackBar.open('Vos données ont été sauvegardées', 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration:2000
                });
                    this.matDialogRef.close(this.abonnementForm);
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
            console.log(abonnement);
            this.abonnementService
                .update(abonnement)
                .subscribe((data) => {
                    this._snackBar.open('Vos données ont été sauvegardées', 'Splash', {
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                      duration:2000
                    });
                    this.matDialogRef.close(this.abonnementForm);
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
              this.abonnementForm.get('latitude').setValue(position.coords.latitude);
              this.abonnementForm.get('longitude').setValue(position.coords.longitude);
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
        const lat = this.abonnementForm.get('latitude')?.value;
        const lng = this.abonnementForm.get('longitude')?.value;
      
        if (lat && lng) {
          const url = `https://www.google.com/maps?q=${lat},${lng}`;
          window.open(url, '_blank'); // ← Ouvre dans un nouvel onglet
        } else {
          alert("Les coordonnées ne sont pas disponibles.");
        }
      }
}
