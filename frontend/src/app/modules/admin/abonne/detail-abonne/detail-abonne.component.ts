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
import { AbonnementMotifAnnulationComponent } from '../../facturation/consultation/abonnement-motif-annulation/abonnement-motif-annulation.component';
import { AddAbonnementComponent } from '../../facturation/add-abonnement/add-abonnement.component';

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
        'montant',
        'etat',
        'created_by',
        'actions'
    ];
    
    token;
    urlForBackend;
    montant: { nonpaye: number; paye: number; } = {nonpaye:0, paye:0};
    actualiser = {};
    constructor(
        private _abonneService: AbonneService,
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _authService: AuthService,
        private _mediaService: MediaService,
        private route: ActivatedRoute,
        private abonnementService:AbonnementService,


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
    
    imprimerTout() {
        this.data['btnprint'] = true;

        this.abonnementService
            .imprimerAbonnement({
                 abonne_id : this.abonne_id
            })
            .subscribe((data: Blob)=>{
                const fileUrl = URL.createObjectURL(data);
                // Ouvrir le fichier dans un nouvel onglet
                window.open(fileUrl, '_blank');
                this.data['btnprint'] = false;
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


    ajouterButton(){
        this.data['btnadd'] = true;
        this.dialogRef = this._matDialog.open(AddAbonnementComponent, {
            panelClass: 'w-full',
            data      : {
                abonnement:{abonne_id: this.abonne_id},
                action: 'new'
            } 
        });
  
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    this.data['btnadd'] = false;
                    return;
                }
                this.data['btnadd'] = false;
                
                this._updateDataSourceAbonnement();
            });
      }

    
    
      _updateDataSourceAbonnement() {
        this.abonnementService
            .findBy({
                 abonne_id:this.abonne_id
            })
            .subscribe((data) => {
                const listeAbonnement = [];
                 (data as Abonnement[]).forEach(abonnement => {
                    listeAbonnement.push(new Abonnement(abonnement));
                 });
                 this.dataSourceAbonnement.data = listeAbonnement;
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

      restorerAbonnement(element: Abonnement) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Resturation de abonnement',
            message:
                'Voulez-vous restaurer l\'abonnement de ' + element.nomprenom + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***Restaure */
                this.abonnementService
                    .restore({id:element.id})
                    .subscribe((data) => {
                        console.log(data);
                        this._updateDataSource();
                    });
            }
        });
    }
    annulerAbonnement(element: Abonnement) {
        this.dialogRef = this._matDialog.open(
            AbonnementMotifAnnulationComponent,
            {
                data: {
                    id: element.id,
                },
            }
        );

        this.dialogRef.afterClosed().subscribe((response: any) => {
            if (!response) {
                return;
            }
            console.log(response);
            this.abonnementService.cancelle(response).subscribe(
                (d) => {
                    this._updateDataSource();
                    console.log(d);
                },
                (err) => {
                    console.log(err);
                }
            );
        });
    }

    supprimerAbonnement(element: Abonnement) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Suppression de abonnement',
            message:
                'Voulez-vous supprimer le abonnement N ' + element.id + ' ?',
        });
        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***DELETE ONE */
                this.abonnementService
                    .delete(element)
                    .subscribe((data) => {
                        console.log(data);
                        this._updateDataSource();
                    });
            }
        });
    }
    
    imprimerAbonnement(element) {
        this.actualiser['btn2'] = true;
        this.abonnementService
            .imprimerAbonnement({
                 id : element.id
            })
            .subscribe((data: Blob)=>{
                const fileUrl = URL.createObjectURL(data);
                // Ouvrir le fichier dans un nouvel onglet
                window.open(fileUrl, '_blank');
                this.actualiser['btn2'] = false;
                this._snackBar.open('Téléchargement terminé', 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000
                });
            });
    }

    
 
}
