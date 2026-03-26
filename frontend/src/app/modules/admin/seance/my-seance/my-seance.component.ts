import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SeanceService } from 'app/core/services/seance.service';
import { Seance } from 'app/models/seance.model';

@Component({
  selector: 'app-my-seance',
  templateUrl: './my-seance.component.html',
  styleUrls: ['./my-seance.component.scss']
})
export class MySeanceComponent implements OnInit {
  @Input('abonneId') abonneId: number;
  abonne_id: number;

  constructor(route: ActivatedRoute, private seanceService: SeanceService) {
    route.params.subscribe((d) => {
      if (d.abonne_id) {
        this.abonne_id = Number(d.abonne_id);
      } else {
        this.abonne_id = this.abonneId
      }
    });
  }

  dialogRef: any;
  actualiser = {};

  seances: Seance[] = [];
  dataSource: MatTableDataSource<Seance> = new MatTableDataSource();

  displayedColumns: string[] = [
    'id',
    'nomprenom',
    'date_seance',
    'heure_debut',
    'heure_fin'
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
    this.seanceService
      .findBy({abonne_id: this.abonne_id})
      .subscribe((data) => {
        const seances = data as Seance[];
        this.seances = [];
        seances.forEach(seance => {
          this.seances.push(new Seance(seance));
        });
        this.dataSource.data = this.seances;

      });
  }

}
