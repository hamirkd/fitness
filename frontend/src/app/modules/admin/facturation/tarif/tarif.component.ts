import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Tarif } from 'app/models/tarif.model';
import { AddTarifComponent } from './add-tarif/add-tarif.component';
import { TarifService } from 'app/core/services/tarif.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-tarif',
    templateUrl: './tarif.component.html',
    styleUrls: ['./tarif.component.scss'],
})
export class TarifComponent implements OnInit {
  constructor(
                  private _fuseConfirmationService: FuseConfirmationService,
      private _matDialog: MatDialog,
      private _tarifService: TarifService
  ) {}

  searchControl: FormControl = new FormControl();
  dialogRef: any;

  dataSource: MatTableDataSource<Tarif> = new MatTableDataSource();

    displayedColumns: string[] = [
        'code',
        'libelle',
        'montant',
        'duree',
        'creation',
        'actions',
    ];

  recherche(textRecherche: string) {
      textRecherche = textRecherche.trim(); // Remove whitespace
      textRecherche = textRecherche.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = textRecherche;
  }
  ngOnInit(): void {
      this._updateDataSource();
  }
  
  _updateDataSource(){
    this._tarifService.getAll().subscribe(data=>{
        console.log(data)
        this.dataSource.data = data;
        console.log(data)
      })
  }
  
  editer(tarif:Tarif): void
  {
      this.dialogRef = this._matDialog.open(AddTarifComponent, {
          panelClass: '',
          data      : {
              tarif,
              action: 'edit'
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
  
  ajouter(): void
  {
      this.dialogRef = this._matDialog.open(AddTarifComponent, {
          panelClass: '',
          data      : {
              tarif:{},
              action: 'new'
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
  supprimer(element: Tarif){
    this.dialogRef = this._fuseConfirmationService.open({
        title: 'Suppression tarification',
        actions: {
            confirm: {
                label: 'Confirmer',
                color: 'primary' ,
            },
            cancel: {
                label: 'Annuler'
            }
        },
        message:
            'Voulez-vous supprimer le tarif N ' + element.libelle + ' ?',
    });

    this.dialogRef.afterClosed().subscribe((response:any) => {
        if (response === 'confirmed') {
            //***DELETE ONE */
            this._tarifService.delete(element).subscribe((data) => {
            });
        }
    });
}
}
