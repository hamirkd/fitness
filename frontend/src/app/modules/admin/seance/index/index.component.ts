import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SeanceService } from 'app/core/services/seance.service';
import { UserService } from 'app/core/user/user.service';
import { Seance } from 'app/models/seance.model';
import moment from 'moment';
import FileSaver from 'file-saver';
import { convertToCSV } from 'app/core/utils';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(
    private seanceService: SeanceService,
    private _snackBar: MatSnackBar,
    private _userService: UserService
  ) {
    this._userService.user$.subscribe((data) => {
      this.user = data;
    });
  }

  dialogRef: any;
  actualiser = {};
  user: {};
  searchControl: FormControl = new FormControl();
  datedebutControl: FormControl = new FormControl();
  datefinControl: FormControl = new FormControl();
  datedebut = moment().subtract(7, 'days').format('YYYY-MM-DD');
  datefin = moment().add(14, 'days').format('YYYY-MM-DD');

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
      .findBy({
        datedebut: this.datedebut,
        datefin: this.datefin,
      })
      .subscribe((data) => {
        const seances = data as Seance[];
        this.seances = [];
        seances.forEach(seance => {
          this.seances.push(new Seance(seance));
        });
        this.dataSource.data = this.seances;

      });
  }
  rechercherButton() {
    this.actualiser['btn1'] = true;
    this._updateDataSource();
    this.actualiser['btn1'] = false;
  }
  exporter() {
    if (!this.seances || this.seances.length == 0) {
      this._snackBar.open('Veuillez revoir les données', 'Splash', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000
      });
      return;
    }
    var blob = new Blob([convertToCSV(this.seances)], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, "seance-liste.csv");
  }
}
