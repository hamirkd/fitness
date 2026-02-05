import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import moment from 'moment';
import { _droit } from '../../DROIT_USER_MODULE';
import { MatSnackBar } from '@angular/material/snack-bar';
import FileSaver from 'file-saver';
import { AbonnementMotifAnnulationComponent } from './abonnement-motif-annulation/abonnement-motif-annulation.component';
import { AbonnementService } from 'app/core/services/abonnement.service';
import { Abonnement } from 'app/models/abonnement.model';

@Component({
    selector: 'app-abonnement',
    templateUrl: './abonnement.component.html',
    styleUrls: ['./abonnement.component.scss'],
})
export class AbonnementComponent implements OnInit {
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private abonnementService: AbonnementService,
        private _snackBar: MatSnackBar,
        private _userService: UserService
    ) {
        this._userService.user$.subscribe((data) => {
            this.user = data;
        });
    }
    _droit = _droit;

    dialogRef: any;
    actualiser = {};
    user: {};
    searchControl: FormControl = new FormControl();
    datedebutControl: FormControl = new FormControl();
    datefinControl: FormControl = new FormControl();
    datedebut = moment().day(1).format('YYYY-MM-DD');
    datefin = moment().day(7).format('YYYY-MM-DD');

    abonnements: Abonnement[] = [];
    dataSource: MatTableDataSource<Abonnement> = new MatTableDataSource();

    displayedColumns: string[] = [
        'id',
        'nomprenom',
        'date_debut',
        'date_fin',
        'duree',
        'remise',
        'montant',
        'montanttotal',
        'etat',
        'actions',
    ];

    recherche(textRecherche) {
        textRecherche = textRecherche.trim(); // Remove whitespace
        textRecherche = textRecherche.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = textRecherche;
    }
    ngOnInit(): void {
        this._updateDataSource();
    }
    _updateDataSource() {
        this.abonnementService
            .findBy({
                datedebut: this.datedebut,
                datefin: this.datefin,
            })
            .subscribe((data) => {
                this.abonnements = data as Abonnement[]; 
                this.dataSource.data = data as Abonnement[];

                this.dataSource.data.forEach(da => {
                    da['nomprenom'] = da.nom + ' ' + da.prenom;
                })
            });
    }
    rechercherButton() {
        this.actualiser['btn1'] = true;
        this._updateDataSource();
        this.actualiser['btn1'] = false;
    }
    restorer(element: Abonnement) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Resturation de abonnement',
            message:
                'Voulez-vous restaurer la abonnement N ' + element.id + ' ?',
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
    annuler(element: Abonnement) {
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
    
    payer(element: Abonnement) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Paiement de abonnement',
            message:
                'Voulez-vous payer la abonnement N ' + element.id + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response: any) => {
            if (!response) {
                return;
            }
            if (response === 'confirmed') {
            console.log(response);
            this.abonnementService.paye(element).subscribe(
                (d) => {
                    this._updateDataSource();
                    console.log(d);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
        });
    }

    supprimer(element: Abonnement) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Suppression de versement',
            message:
                'Voulez-vous supprimer le versement N ' + element.id + ' ?',
        });
        console.log(this.user);

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
    
    imprimer(element) {
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
    
    exporter(){
        if(!this.abonnements||this.abonnements.length==0){
        
            this._snackBar.open('Veuillez revoir les données', 'Splash', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration:2000
                });
        return;
        }
        let listeAImprimer: {matricule,nomprenom,montant,dateversement}[]=[];
        this.abonnements.forEach(o=>listeAImprimer.push({matricule:o['matricule'],nomprenom:o['nomprenom'],
        montant:o['montant'],dateversement:o['dateversement']}));
  
        var blob = new Blob([this.convertToCSV(listeAImprimer)], {type: "text/csv;charset=utf-8"});
        FileSaver.saveAs(blob,"paiement-liste.csv");
    }

    convertToCSV(arr) {
        arr.forEach(item=>{
            Object.keys(arr[0]).forEach(champ => {
                item[champ]=item[champ]?item[champ].toString().trim():item[champ]
              });
          })
          const array = [Object.keys(arr[0])].concat(arr)
          return array.map(it => {
              return Object.values(it).join(';').toString()
          }).join('\n')
      }
}
