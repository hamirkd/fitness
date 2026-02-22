// recap-abonnement.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbonnementService } from 'app/core/services/abonnement.service';

@Component({
  selector: 'app-recap-abonnement',
  template: `
    <h2 mat-dialog-title class="bg-green-600 text-white p-4 m-0">
      <mat-icon class="align-middle mr-2">check_circle</mat-icon>
      Abonnement enregistré avec succès !
    </h2>
    
    <mat-dialog-content class="p-6">
      <!-- En-tête avec message de confirmation -->
      <div class="text-center mb-6">
        <mat-icon class="text-green-600 text-6xl" style="width:auto; height:auto; font-size:64px;">check_circle</mat-icon>
        <h3 class="text-xl font-bold mt-2">Récapitulatif de l'abonnement</h3>
      </div>
      
      <!-- Carte récapitulative -->
      <div class="shadow-lg">
        <div>
          <!-- Informations abonné -->
          <div class="border-b pb-4 mb-4">
            <h4 class="text-gray-600 font-semibold mb-3">Informations abonné</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Nom complet</p>
                <p class="font-medium">{{data.abonnement.nom_prenom}}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Téléphone</p>
                <p class="font-medium">{{data.abonnement.abonne?.telephone}}</p>
              </div>
            </div>
          </div>
          
          <!-- Informations abonnement -->
          <div class="border-b pb-4 mb-4">
            <h4 class="text-gray-600 font-semibold mb-3">Détails abonnement</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Tarif</p>
                <p class="font-medium">{{data.abonnement.tarif?.code}} - {{data.abonnement.tarif?.libelle}}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Montant</p>
                <p class="font-medium text-green-600">{{data.abonnement.montant | currency:'XOF':'symbol':'1.0-0'}}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Date début</p>
                <p class="font-medium">{{data.abonnement.date_debut | date:'dd/MM/yyyy'}}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Date fin</p>
                <p class="font-medium">{{data.abonnement.date_fin | date:'dd/MM/yyyy'}}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Mode de paiement</p>
                <p class="font-medium">{{data.abonnement.mode_paiement}}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Statut</p>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Actif
                </span>
              </div>
            </div>
          </div>
          
          <!-- Période et durée -->
          <div>
            <h4 class="text-gray-600 font-semibold mb-3">Période</h4>
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div class="text-center">
                <p class="text-sm text-gray-500">Début</p>
                <p class="font-bold">{{data.abonnement.date_debut | date:'dd/MM/yyyy'}}</p>
              </div>
              <mat-icon class="text-gray-400">arrow_forward</mat-icon>
              <div class="text-center">
                <p class="text-sm text-gray-500">Fin</p>
                <p class="font-bold">{{data.abonnement.date_fin | date:'dd/MM/yyyy'}}</p>
              </div>
              <div class="text-center border-l pl-4">
                <p class="text-sm text-gray-500">Durée</p>
                <p class="font-bold text-blue-600">{{data.abonnement.duree}} jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions supplémentaires -->
      <div class="flex justify-center gap-4 mt-6">
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end" class="p-4 border-t">

    <button mat-stroked-button color="primary" (click)="printRecap()">
          <mat-icon>print</mat-icon>
          Imprimer
        </button>
        
      <button mat-raised-button color="primary" (click)="newAbonnement()">
        <mat-icon>add</mat-icon>
        Nouvel abonnement
      </button>
      <button mat-button (click)="close()">Fermer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
    }
    mat-dialog-content {
      max-height: 80vh;
    }
  `]
})
export class RecapAbonnementComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RecapAbonnementComponent>,
    private abonnementService: AbonnementService,
    private _snackBar: MatSnackBar,
  ) {}

  printRecap() {
    
    this.abonnementService
        .imprimerAbonnement({
             id : this.data.abonnement.id
        })
        .subscribe((data: Blob)=>{
            const fileUrl = URL.createObjectURL(data);
            // Ouvrir le fichier dans un nouvel onglet
            window.open(fileUrl, '_blank');
            this._snackBar.open('Téléchargement terminé', 'Splash', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2000
            });
        });
  }

  sendByWhatsApp() {
    // Logique d'envoi d'email
    console.log('Envoi par email', this.data);
  }

  close() {
    this.dialogRef.close();
  }

  newAbonnement() {
    this.dialogRef.close('new');
  }
}