import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { Facture } from 'app/models/facture.model';
import moment from 'moment';
import { _droit } from '../../DROIT_USER_MODULE';
import { MatSnackBar } from '@angular/material/snack-bar';
import FileSaver from 'file-saver';
import { FactureMotifAnnulationComponent } from '../consultation/facture-motif-annulation/facture-motif-annulation.component';
import { FactureService } from 'app/core/services/facture.service';

@Component({
    selector: 'app-nouvelle-facture',
    templateUrl: './nouvelle-facture.component.html',
    styleUrls: ['./nouvelle-facture.component.scss'],
})
export class NouvelleFactureComponent implements OnInit {
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private _factureService: FactureService,
        private _snackBar: MatSnackBar,
        private _userService: UserService
    ) {
        this._userService.user$.subscribe((data) => {
            this.user = data;
            console.log(this.user);
        });
    }
    _droit = _droit;

    dialogRef: any;
    actualiser = {};
    user: {};
    searchControl: FormControl = new FormControl();
    datefinControl: FormControl = new FormControl();
    periodeControl: FormControl = new FormControl();
    periode = moment().day(1).format('YYYY-MM-DD');
    datefin = moment().day(7).format('YYYY-MM-DD');
    
    moisControl: FormControl = new FormControl();
    mois = moment().format('MM');
    
    anneeControl: FormControl = new FormControl();
    annee = moment().format('YYYY');
    anneeActuelleL = ( Number(moment().format('YYYY'))-1) + '';
    anneeActuelle = moment().format('YYYY');
    anneeActuelleR =  ( Number(moment().format('YYYY')) + 1) + '';

    dataSource: MatTableDataSource<Facture> = new MatTableDataSource();

    displayedColumns: string[] = [
        'id',
        'nomprenom',
        'numerocompteur',
        'typeclient',
        'prixunitaire',
        'redevance',
        'ancienindex',
        'nouveauindex',
        'consommation',
        'montant',
        'montanttotal',
        'etat'
    ];

    recherche(textRecherche) {
        textRecherche = textRecherche.trim(); // Remove whitespace
        textRecherche = textRecherche.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = textRecherche;
    }
    

    calcule(textRecherche, element) {
        if(textRecherche) {
            element.consommation = textRecherche - element.ancienindex;
            element.montanttotal = element.consommation * element.prixunitaire + element.redevance;
            element.montant = element.consommation * element.prixunitaire;
        } else {
            element.consommation = undefined;
            element.montanttotal = undefined;
            element.montant = undefined;
        }
    }
    ngOnInit(): void {
        this._updateDataSource();
    }
    _updateDataSource() {
        this._factureService
            .findBy({
                 periode : this.annee + '-' + this.mois + '-01'
            })
            .subscribe((data) => {
                this.dataSource.data = data as Facture[];
                this.dataSource.data.forEach(da => {
                    da['nomprenom'] = da.nom + ' ' + da.prenom;
                    da['numerocompteur'] = da.client?.numerocompteur;
                })
            });
    }
    rechercherButton() {
        this.actualiser['btn1'] = true;
        this._updateDataSource();
        this.actualiser['btn1'] = false;
    }
    restorer(element: Facture) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Resturation de facture',
            message:
                'Voulez-vous restaurer la facture N ' + element.id + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***Restaure */
                this._factureService
                    .restore({id:element.id})
                    .subscribe((data) => {
                        console.log(data);
                        this._updateDataSource();
                    });
            }
        });
    }
    annuler(element: Facture) {
        this.dialogRef = this._matDialog.open(
            FactureMotifAnnulationComponent,
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
            this._factureService.cancelle(response).subscribe(
                (d) => {
                    this._updateDataSource();
                    console.log(d);
                },
                (err) => {
                    
                        this._snackBar.open(err.error.message, 'Splash', {
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                            duration:2000
                            });
                    
                }
            );
        });
    }

    supprimer(element: Facture) {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Suppression de la facture',
            message:
                'Voulez-vous supprimer la facture N ' + element.id + ' ?',
        });
        console.log(this.user);

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***DELETE ONE */
                this._factureService
                    .delete(element)
                    .subscribe((data) => {
                        console.log(data);
                        this._updateDataSource();
                    },err=>{
                        this._snackBar.open(err.error.message, 'Splash', {
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                            duration:2000
                            });
                    });
            }
        });
    }
    generer() {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Voulez vous générer les factures',
            message:
                'Voulez-vous générer les factures de la période '
                + this.mois + ' ' + this.annee + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***DELETE ONE */
                this._factureService
                    .findByNouvelleFacture({
                        periode : this.annee + '-' + this.mois + '-01'
                    })
                    .subscribe((data) => {
                        this._updateDataSource();
                    },err=>{
                        this._snackBar.open(err.error.message, 'Splash', {
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                            duration:10000
                            });
                    });
            }
        });
    }
    regenerer() {
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Voulez vous générer les factures',
            message:
                'Voulez-vous supprimer et recréer les factures de la période '
                + this.mois + ' ' + this.annee + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***DELETE ONE */
                this._factureService
                    .findByNouvelleFacture({
                        periode : this.annee + '-' + this.mois + '-01',
                        type: 'REGENERE'
                    })
                    .subscribe((data) => {
                        this._updateDataSource();
                    },err=>{
                        this._snackBar.open(err.error.message, 'Splash', {
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                            duration:10000
                            });
                    });
            }
        });
    }

    
    sauvegarder() {
        this._factureService
            .addMost(this.dataSource.data)
            .subscribe((data) => {
                this._updateDataSource();
                this._snackBar.open(data.message, 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration:2000
                  });
            },err=>{
                
                this._snackBar.open(err.error.message, 'Splash', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration:10000
                  });
            });
             
    }
    imprimer() {
        this._factureService
            .imprimerFacture({
                 periode : this.annee + '-' + this.mois + '-01'
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
        if(!this.dataSource.data||this.dataSource.data.length==0){
        
            this._snackBar.open('Veuillez revoir les données', 'Splash', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration:2000
                });
        return;
        }
        let listeAImprimer: any[]=[];
        this.dataSource.data.forEach(o=>listeAImprimer.push({
            numerocompteur:o['numerocompteur'],
            nomprenom:o['nomprenom'],
            montant:o['montant'],
            periode:o['periode'],
            ancienindex:o['ancienindex'],
            nouveauindex:o['nouveauindex'],
            consommation:o['consommation'],
        }));
  
        var blob = new Blob([this.convertToCSV(listeAImprimer)], {type: "text/csv;charset=utf-8"});
        FileSaver.saveAs(blob,"facture-liste.csv");
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
