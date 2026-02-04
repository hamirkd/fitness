import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FactureService } from 'app/core/services/facture.service';
import { Facture } from 'app/models/facture.model';
@Component({
  selector: 'app-facturation',
  templateUrl: './facturation.component.html',
  styleUrls: ['./facturation.component.scss']
})
export class FacturationComponent implements OnInit {
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
  constructor(private _factureService: FactureService) { }
  nombre_de_fille=0;
  nombre_de_garcon=0;
  nombre_de_fille_aff=0;
  nombre_de_garcon_aff=0;
  ngOnInit(): void {
    this._updateDataSource();
    
  }
  _updateDataSource() {
    this._factureService
        .findBy({
             etat:'NONPAYE'
        })
        .subscribe((data) => {
            this.dataSource.data = data as Facture[];
            this.dataSource.data.forEach(da => {
                da['nomprenom'] = da.nom + ' ' + da.prenom;
                da['numerocompteur'] = da.client?.numerocompteur;
            })
        });
}

}
