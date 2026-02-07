import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AbonnementService } from 'app/core/services/abonnement.service';
import { Abonnement } from 'app/models/abonnement.model';
import { AddAbonnementComponent } from './add-abonnement/add-abonnement.component';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AbonnementIndexComponent implements OnInit {
  dataSource: MatTableDataSource<Abonnement> = new MatTableDataSource();

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
  dialogRef: any;
  constructor(private _abonnementService: AbonnementService,
    private _matDialog: MatDialog) { }
  nombre_de_fille = 0;
  nombre_de_garcon = 0;
  nombre_de_fille_aff = 0;
  nombre_de_garcon_aff = 0;
  ngOnInit(): void {
    this._updateDataSource();

  }
  _updateDataSource() {
    this._abonnementService
      .findBy({
        etat: 'NONPAYE'
      })
      .subscribe((data) => {
        this.dataSource.data = data as Abonnement[];
        this.dataSource.data.forEach(da => {
          da['nomprenom'] = da.nom + ' ' + da.prenom;
        })
      });
  }
  ajouterButton() {
    this.dialogRef = this._matDialog.open(AddAbonnementComponent, {
      // panelClass: 'w-full',
      data: {
        abonnement: {},
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
      });
  }

}
