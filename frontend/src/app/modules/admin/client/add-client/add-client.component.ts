import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from 'app/core/services/client.service';
import { Client } from 'app/models/client.model';

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
    styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {
    @Input() name;

    client: Client;
    action: 'edit' | 'new' = 'new';

    formFieldHelpers: string[] = [''];
    precision: number = 0;
    constructor(
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public matDialogRef: MatDialogRef<AddClientComponent>,private _snackBar: MatSnackBar,
        public clientService: ClientService
    ) {
        this.client = new Client(_data.client);
        this.action = _data.action;
        this.clientForm = this.createClientForm();
    }
    clientForm: FormGroup;

    ngOnInit(): void {
    }
    /**
     * Create user form
     *
     * @returns {FormGroup}
     */

    createClientForm(): FormGroup {
        return this._formBuilder.group({
        id:[this.client.id],
        nom:[this.client.nom],
        prenom:[this.client.prenom],
        datenais:[this.client.datenais],
        genre:[this.client.genre],
        telephone:[this.client.telephone],
        email:[this.client.email],
        observation:[this.client.observation],
        typeclient:[this.client.typeclient],
        cnib:[this.client.cnib],
        numerocompteur:[this.client.numerocompteur],
        lieunais:[this.client.lieunais],
        ancienindex:[this.client.ancienindex],
        longitude:[this.client.longitude],
        latitude:[this.client.latitude],
        
    });
    }

    onSubmit() {
        let client = new Client(this.clientForm.getRawValue());
       
        if (this.action == 'new') {
            this.clientService.add(client).subscribe(
                (data) => {
                    
                this._snackBar.open('Vos données ont été sauvegardées', 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration:2000
                });
                    this.matDialogRef.close(this.clientForm);
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
            console.log(client);
            this.clientService
                .update(client)
                .subscribe((data) => {
                    this._snackBar.open('Vos données ont été sauvegardées', 'Splash', {
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                      duration:2000
                    });
                    this.matDialogRef.close(this.clientForm);
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
              this.clientForm.get('latitude').setValue(position.coords.latitude);
              this.clientForm.get('longitude').setValue(position.coords.longitude);
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
        const lat = this.clientForm.get('latitude')?.value;
        const lng = this.clientForm.get('longitude')?.value;
      
        if (lat && lng) {
          const url = `https://www.google.com/maps?q=${lat},${lng}`;
          window.open(url, '_blank'); // ← Ouvre dans un nouvel onglet
        } else {
          alert("Les coordonnées ne sont pas disponibles.");
        }
      }
}
