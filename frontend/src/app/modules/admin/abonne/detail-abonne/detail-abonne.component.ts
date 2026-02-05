import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { saveAs } from 'file-saver';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Media } from 'app/models/media.model';
import { MediaService } from 'app/core/services/media.service';
import { AbonneService } from 'app/core/services/abonne.service';
import { Abonne } from 'app/models/abonne.model';
import { AddAbonneComponent } from '../add-abonne/add-abonne.component';
import { ActivatedRoute } from '@angular/router';
import { Abonnement } from 'app/models/abonnement.model';
import { AbonnementService } from 'app/core/services/abonnement.service';
import { MediaAddComponent } from '../media-add/media-add.component';

@Component({
    selector: 'app-detail-abonne',
    templateUrl: './detail-abonne.component.html',
    styleUrls: ['./detail-abonne.component.scss'],
})
export class DetailAbonneComponent implements OnInit {
    @ViewChild('supportNgForm') supportNgForm: NgForm;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    
    abonne: Abonne = new Abonne({});
    data = {};
    abonne_id;
    dialogRef: any;
    editMode: boolean = false;
    userAvatarForm = new FormControl('');

    dataSourceAbonnement: MatTableDataSource<Abonnement> = new MatTableDataSource();
    dataSourceDocument: MatTableDataSource<{}> = new MatTableDataSource();
    displayedColumnsDocument: string[] = [
        // 'type_documents',
        'no',
        'libelle_document',
        'created_at',
        'actions',
    ];
    displayedColumnsAbonnement: string[] = [
        'id',
        'date_debut',
        'date_fin',
        'duree',
        'remise',
        'montant',
        'montanttotal',
        'etat',
        'actions'
    ];
    
    token;
    urlForBackend;
    montant: { nonpaye: number; paye: number; } = {nonpaye:0, paye:0};
    constructor(
        private _abonneService: AbonneService,
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _authService: AuthService,
        private _mediaService: MediaService,
        private route: ActivatedRoute,
        private _factureService:AbonnementService

    ) {
        this.token = this._authService.accessToken;
        this.urlForBackend = environment.urlApi;
        route.params.subscribe((d) => {
            console.log(d)
            this.abonne_id = Number(d.abonne_id);
        });

    }

    ngOnInit(): void {
        this._updateDataSource();
        this._updateDataSourceDocument();
        this._updateDataSourceAbonnement();
    }
    _updateDataSource() {
        this._abonneService.get(this.abonne_id).subscribe(data=>{
            this.abonne = new Abonne(data);
        });
    }
    supprimer(contrat) {
      
    }
  
    editer(){
        this.dialogRef = this._matDialog.open(AddAbonneComponent, {
          panelClass: 'w-full',
          data      : {
              abonne:new Abonne(this.abonne),
              action: 'update'
          } 
      });
  
      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
              if ( !response )
              {
                  return;
              }
              
              this._updateDataSource();
          });
      }
    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.userAvatarForm.get('avatar');

        // Set the avatar as null
        //  avatarFormControl.setValue(null);

        // Set the file input value as null
        //  this._avatarFileInput.nativeElement.value = null;

        // Upload the avatar
        this.abonne.file_name = null;
        this._abonneService.removeAvatar(this.abonne_id).subscribe((data) => {
            console.log(data);
            this.abonne = data;
        });
        // Update the contact
        //  this.abonne.avatar = null;
    }

    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        // Upload the avatar
        this.abonne.file_name = null;
        this._abonneService
            .uploadAvatar(this.abonne_id + '', file)
            .subscribe((data) => {
                // this._updateDataSource();
                this.abonne = data;
                console.log(this.abonne);
            });
    } 
    
    payer(element: Abonnement) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Paiement de facture',
            message:
                'Voulez-vous payer la facture N ' + element.id + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response: any) => {
            if (!response) {
                return;
            }
            if (response === 'confirmed') {
            console.log(response);
            this._factureService.paye(element).subscribe(
                (d) => {
                    this._updateDataSourceAbonnement();
                    console.log(d);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
        });
    }
 

    supprimerContrat(element) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Suppression de contrat',
            message:
                'Voulez-vous supprimer le contrat N ' + element.id + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***DELETE ONE */
                // this._contratService.delete(element).subscribe((data) => {
                // });
            }
        });
    }
    _updateDataSourceDocument() {
        this._mediaService
            .getMediaByTypeAndId({
                type_documents: 'DOSSIERS_CLIENTS',
                parent_id: this.abonne_id,
            })
            .subscribe((d) => {
                this.dataSourceDocument.data = d as Media[];
            });
    }
    addDocument(): void {
        this.dialogRef = this._matDialog.open(MediaAddComponent, {
            panelClass: '',
            data: {
                media: {
                    type_documents: 'DOSSIERS_CLIENTS',
                    parent_id: this.abonne_id,
                },
            },
        });

        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }

            this._updateDataSourceDocument();
        });
    }
    
    imprimer() {
        this.data['btnadd'] = true;

        this._factureService
            .imprimerAbonnement({
                 abonne_id : this.abonne_id
            })
            .subscribe((data: Blob)=>{
                const fileUrl = URL.createObjectURL(data);
                // Ouvrir le fichier dans un nouvel onglet
                window.open(fileUrl, '_blank');
                this.data['btnadd'] = false;
                this._snackBar.open('Téléchargement terminé', 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000
                });
            });
    }
    
    imprimerUn(element) {
 
        this._factureService
            .imprimerAbonnement({
                 id : element.id
            })
            .subscribe((data: Blob)=>{
                const fileUrl = URL.createObjectURL(data);
                // Ouvrir le fichier dans un nouvel onglet
                window.open(fileUrl, '_blank');
                this.data['btnadd'] = false;
                this._snackBar.open('Téléchargement terminé', 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000
                });
            });
    }

    supprimerDocument(element: Media) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Suppression de document',
            message: 'Voulez-vous supprimer le document N ' + element.id + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***DELETE ONE */
                this._mediaService.delete(element).subscribe((data) => {
                    console.log(data);
                    this._updateDataSourceDocument();
                });
            }
        });
    }

    imprimerDocument(element: Media) {
        this.data['btno' + element.id] = true;
        this._mediaService.getDocument(element.id).subscribe(
            (data) => {
                console.log(data);
                let ext = '';
                if (element.file_name.lastIndexOf('.') >= 0)
                    element.file_name.substring(
                        element.file_name.lastIndexOf('.')
                    );
                saveAs(data, element.libelle_document + ext);
                this.data['btno' + element.id] = false;
                this._snackBar.open('Téléchargement terminé', 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000,
                });
            },
            (err) => {
                this.data['btno' + element.id] = false;
            }
        );
    }

    addAbonnement() {

    }
    imprimerAbonnement(element) {

    }
    
      _updateDataSourceAbonnement() {
        this._factureService
            .findBy({
                 abonne_id:this.abonne_id
            })
            .subscribe((data) => {
                this.dataSourceAbonnement.data = data as Abonnement[];
                this.montant ={nonpaye:0, paye:0};
                this.dataSourceAbonnement.data.forEach(da => {
                    da['nomprenom'] = da.nom + ' ' + da.prenom;
                    da['numerocompteur'] = da.abonne?.numerocompteur;
                    if (da.etat == 'PAYE') {
                        this.montant.paye = this.montant.paye + Number(da.montanttotal ?? 0);
                    } else {
                        this.montant.nonpaye = this.montant.nonpaye + Number(da.montanttotal ?? 0);
                    }
                })
            });
    }
 
    openInGoogleMaps() {
        // const lat = this.abonne.latitude;
        // const lng = this.abonne.longitude;
      
        // if (lat && lng) {
        //   const url = `https://www.google.com/maps?q=${lat},${lng}`;
        //   window.open(url, '_blank'); // ← Ouvre dans un nouvel onglet
        // } else {
        //   alert("Les coordonnées ne sont pas disponibles.");
        // }
      }
 
}
