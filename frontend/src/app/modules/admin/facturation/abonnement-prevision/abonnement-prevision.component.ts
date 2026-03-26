import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AbonnementService } from 'app/core/services/abonnement.service';
import { UserService } from 'app/core/user/user.service';
import { convertToCSV } from 'app/core/utils';
import { Abonnement } from 'app/models/abonnement.model';
import FileSaver from 'file-saver';


@Component({
  selector: 'app-abonnement-prevision',
  templateUrl: './abonnement-prevision.component.html',
  styleUrls: ['./abonnement-prevision.component.scss']
})
export class AbonnementPrevisionComponent implements OnInit {


  actualiser = {};
  searchControl: FormControl = new FormControl();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  abonnements: Abonnement[] = [];
  dataSource: MatTableDataSource<Abonnement> = new MatTableDataSource();

  displayedColumns: string[] = [
    'nomprenom',
    'type_abonnement',
    'date_fin',
  ];
  constructor(
    private abonnementService: AbonnementService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
  ) {
  }

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
      .findByPrevision({})
      .subscribe((data) => {
        const abonnements = data as Abonnement[];
        this.abonnements = [];
        abonnements.forEach(abonnement => {
          console.log(abonnement)
          this.abonnements.push(new Abonnement(abonnement));
        });
        this.dataSource.data = this.abonnements;
        this.dataSource.paginator = this.paginator;


      });
  }
  exporter() {
    if (!this.abonnements || this.abonnements.length == 0) {

      this._snackBar.open('Veuillez revoir les données', 'Splash', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000
      });
      return;
    }
    let listeAImprimer: { matricule, nomprenom, montant, dateversement }[] = [];
    this.abonnements.forEach(o => listeAImprimer.push({
      matricule: o['matricule'], nomprenom: o['nomprenom'],
      montant: o['montant'], dateversement: o['dateversement']
    }));

    var blob = new Blob([convertToCSV(listeAImprimer)], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, "abonnement-liste.csv");
  }
  getExpirationClass(dateStr: string): { [key: string]: boolean } {
    const today = new Date();
    const dateExp = new Date(dateStr);

    const diffDays = Math.ceil(
      (dateExp.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    // 🔴 déjà expiré
    if (diffDays < 0) {
      return { 'text-white': true,'bg-red-300': true };
    }

    // 🔴 très urgent
    if (diffDays <= 2) {
      return { 'text-white': true, 'bg-orange-800': true };
    }

    // 🟠 attention
    if (diffDays <= 5) {
      return { 'text-white': true, 'bg-green-900': true };
    }

    // 🟢 ok
    if (diffDays <= 8) {
      return { 'text-white': true, 'bg-green-600': true };
    }

    return {};
  }
  // getExpirationClass(dateStr: string): { [key: string]: boolean } {
  //   const today = new Date();
  //   const dateExp = new Date(dateStr);

  //   const diffDays = Math.ceil(
  //     (dateExp.getTime() - today.getTime()) / (1000 * 3600 * 24)
  //   );

  //   // 🔴 déjà expiré
  //   if (diffDays < 0) {
  //     return { 'text-red-600': true,'bg-red-600': true };
  //   }

  //   // 🔴 très urgent
  //   if (diffDays <= 2) {
  //     return { 'text-orange-800': true, 'bg-orange-800': true };
  //   }

  //   // 🟠 attention
  //   if (diffDays <= 5) {
  //     return { 'text-green-900': true, 'bg-green-900': true };
  //   }

  //   // 🟢 ok
  //   if (diffDays <= 8) {
  //     return { 'text-green-600': true, 'bg-green-600': true };
  //   }

  //   return {};
  // }
}
