import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbonneService } from 'app/core/services/abonne.service';
import { AbonnementService } from 'app/core/services/abonnement.service';
import { TarifService } from 'app/core/services/tarif.service';
import { Abonne } from 'app/models/abonne.model';
import { Abonnement } from 'app/models/abonnement.model';
import { Tarif } from 'app/models/tarif.model';
import { RecapAbonnementComponent } from './recap-abonnement.component';

@Component({
  selector: 'app-add-abonnement',
  templateUrl: './add-abonnement.component.html',
  styleUrls: ['./add-abonnement.component.scss'],
})
export class AddAbonnementComponent implements OnInit {
  @Input() name;

  abonnement: Abonnement;
  action: 'update' | 'new' | 'pause' = 'new';

  formFieldHelpers: string[] = [''];
  precision: number = 0;
  abonnes: Array<Abonne>;
  tarifs: Array<Tarif>;
  mode_paiements = ['CAISSE', 'ORANGE MONEY', 'MOOV MONEY']
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<AddAbonnementComponent>, private _snackBar: MatSnackBar,
    public abonnementService: AbonnementService,
    public abonneService: AbonneService,
    public tarifService: TarifService,
    private _matDialog: MatDialog
  ) {
    this.abonnement = new Abonnement(_data.abonnement);
    this.action = _data.action;
    if (this.action === 'new') {
      this.abonnementForm = this.createAbonnementForm();
    } else if (this.action === 'update') {
      this.abonnementForm = this.updateAbonnementForm();
    } else {
      this.abonnementForm = this.pauseAbonnementForm();
    }
  }
  abonnementForm: FormGroup;

  ngOnInit(): void {
    this.abonneService.getAlls().subscribe(datas => {
      this.abonnes = datas;
    });

    this.tarifService.getAll().subscribe(datas => {
      this.tarifs = datas;
    });
    // Écouter les changements de tarif
    this.abonnementForm.get('tarif_id')?.valueChanges.subscribe(tarifId => {
      if (tarifId) {
        // Activer les champs si un tarif est sélectionné
        this.enableAbonnementFields();
        
        // Optionnel : calculer automatiquement la date de fin
        this.calculateDateFin(tarifId);
      } else {
        // Désactiver les champs si aucun tarif n'est sélectionné
        this.disableAbonnementFields();
      }
    });

  }
  /**
   * Create abonnement form
   *
   * @returns {FormGroup}
   */

  createAbonnementForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.abonnement.id],
      abonne_id: [this.abonnement.abonne_id],
      tarif_id: [this.abonnement.tarif_id],
      date_debut: [this.abonnement.date_debut || new Date().toISOString().split('T')[0]],
      date_fin: [{value: this.abonnement.date_fin, disabled: true}],
      mode_paiement: [this.abonnement.mode_paiement || 'CAISSE'],
      date_pause: [this.abonnement.date_pause]
    });
  }
  /**
   * Update abonnement form
   *
   * @returns {FormGroup}
   */

  updateAbonnementForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.abonnement.id],
      abonne_id: [this.abonnement.abonne_id],
      tarif_id: [{value:this.abonnement.tarif_id, disabled: this.abonnement.tarif_id}],
      date_debut: [this.abonnement.date_debut],
      date_fin: [{value: this.abonnement.date_fin, disabled: true}],
      mode_paiement: [this.abonnement.mode_paiement],
      date_pause: [this.abonnement.date_pause]
    });
  }

  pauseAbonnementForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.abonnement.id],
      abonne_id: [{value:this.abonnement.abonne_id, disabled: true}],
      tarif_id: [{value:this.abonnement.tarif_id, disabled: this.abonnement.tarif_id}],
      date_debut: [{value:this.abonnement.date_debut, disabled:true}],
      date_fin: [{value: this.abonnement.date_fin, disabled: true}],
      mode_paiement: [{value:this.abonnement.mode_paiement, disabled: true}],
      date_pause: [this.abonnement.date_pause]
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
            duration: 2000
          });
          this.matDialogRef.close(this.abonnementForm);
          
          // Ouvrir le dialogue de récapitulatif
          this._matDialog.open(RecapAbonnementComponent, {
            width: '1/2',
            data: data,
            disableClose: true // Empêche la fermeture accidentelle
          }).afterClosed().subscribe(result => {
            if (result === 'new') {
              // Ouvrir un nouveau formulaire d'abonnement
              this.openNewAbonnementDialog();
            }
          });

        },
        (err) => {
          console.log(err);
          this._snackBar.open('Une erreur intervenue', 'Splash', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000
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
            duration: 2000
          });
          this.matDialogRef.close(this.abonnementForm);
        }, err => {

          this._snackBar.open('Une erreur intervenue', 'Splash', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000
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
  // onSelectDateDebut(event) {
  //   console.log(event);
    
  //   const date_debut = event?.target?.value;
  //   console.log(date_debut);
  //   if (!date_debut) {
  //     this.abonnementForm.patchValue({'date_fin': null})
  //     return;
  //   }
  //   const abonnement = new Abonnement(this.abonnementForm.getRawValue());

  //   const tarif = this.tarifs.find(t => t.id == abonnement.tarif_id);
  //   console.log(tarif);
  //   const date_fin = new Date(date_debut);
  //   date_fin.setDate(date_fin.getDate() + tarif.duree);
  //   // toISOString returns "2026-03-24T00:00:00.000Z", we just need the first part
  //   const formattedDate = date_fin.toISOString().split('T')[0];
    
  //   this.abonnementForm.patchValue({'date_fin': formattedDate});



  // }
  enableAbonnementFields() {
    this.abonnementForm.get('date_debut')?.enable();
    this.abonnementForm.get('date_fin')?.enable();
    this.abonnementForm.get('mode_paiement')?.enable();
    
    // Mettre à jour la validation
    this.abonnementForm.get('date_debut')?.setValidators(Validators.required);
    this.abonnementForm.get('date_fin')?.setValidators(Validators.required);
    this.abonnementForm.get('mode_paiement')?.setValidators(Validators.required);
    
    this.abonnementForm.get('date_debut')?.updateValueAndValidity();
    this.abonnementForm.get('date_fin')?.updateValueAndValidity();
    this.abonnementForm.get('mode_paiement')?.updateValueAndValidity();
  }
  
  disableAbonnementFields() {
    this.abonnementForm.get('date_debut')?.disable();
    this.abonnementForm.get('date_fin')?.disable();
    this.abonnementForm.get('mode_paiement')?.disable();
    
    // Enlever les validateurs
    this.abonnementForm.get('date_debut')?.clearValidators();
    this.abonnementForm.get('date_fin')?.clearValidators();
    this.abonnementForm.get('mode_paiement')?.clearValidators();
    
    this.abonnementForm.get('date_debut')?.updateValueAndValidity();
    this.abonnementForm.get('date_fin')?.updateValueAndValidity();
    this.abonnementForm.get('mode_paiement')?.updateValueAndValidity();
  }
  
  calculateDateFin(tarifId: number) {
    const tarif = this.tarifs.find(t => t.id == tarifId);
    const date_debut = this.abonnementForm.get('date_debut')?.value;
    
    if (tarif && date_debut) {
      const dateFin = new Date(date_debut);
      dateFin.setDate(dateFin.getDate() + tarif.duree - 1);
      const formattedDate = dateFin.toISOString().split('T')[0];
      this.abonnementForm.patchValue({date_fin: formattedDate});
    }
  }
  
  onSelectDateDebut(event: any) {
    const tarifId = this.abonnementForm.get('tarif_id')?.value;
    if (tarifId) {
      this.calculateDateFin(tarifId);
    }
  }
  // Getter pour vérifier si un tarif est sélectionné
  tarifSelected(): boolean {
    return this.abonnementForm?.get('tarif_id')?.value;
  }
  openNewAbonnementDialog() {
    this._matDialog.open(AddAbonnementComponent, {
      panelClass: 'w-1/2',
      data: {
        abonnement: {},
        action: 'new'
      },
      disableClose: true
    });
  }

}
