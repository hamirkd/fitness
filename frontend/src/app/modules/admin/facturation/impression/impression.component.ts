import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AnneeService } from 'app/core/services/annee.service';
import { ClasseService } from 'app/core/services/classe.service';
import { InscriptionsService } from 'app/core/services/inscriptions.service';
import { SalleClasseService } from 'app/core/services/salle-classe.service';
import { VersementsService } from 'app/core/services/versements.service';
import { Classe } from 'app/models/classe.model';
import { InscriptionEleve } from 'app/models/inscription-eleve.model';
import { SalleClasse } from 'app/models/salle-classe.model';
import { saveAs } from 'file-saver';
import { HistoriquePaiementComponent } from './historique-paiement/historique-paiement.component';

@Component({
  selector: 'app-impression',
  templateUrl: './impression.component.html',
  styleUrls: ['./impression.component.scss']
})
export class ImpressionComponent  implements OnInit {
  listeSalle: SalleClasse[] = [];
  listeClasse: Classe[] = [];
  salle_classe_id = 0;
  classe_id = 0;
  dialogRef: any; 
  data:any={}
  constructor(
      private _anneeService: AnneeService,private _snackBar: MatSnackBar,
      private salleClasseService: SalleClasseService,
      private _versementsService: VersementsService,
      private classeService: ClasseService,
      private _matDialog: MatDialog,
  ) {}

  searchControl: FormControl = new FormControl();

  eleves: InscriptionEleve[] = [];
  dataSource: MatTableDataSource<InscriptionEleve> = new MatTableDataSource();

  displayedColumns: string[] = [
      'id',
      'nom',
      'prenom',
      'niveau',
      'scolarite',
      'montantverse',
      'salleclasse',
      'actions',
  ];

  recherche(textRecherche) {
      textRecherche = textRecherche.trim(); // Remove whitespace
      textRecherche = textRecherche.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = textRecherche;
  }

  ngOnInit(): void {
      // this._versementsService
      //     .getAllBy({ annee_id: this._anneeService.activeAnnee.id })
      //     .subscribe((data) => {
      //         this.eleves = data as InscriptionEleve[];
      //         this.dataSource.data = this.eleves;
      //     });
      // this._updateDataSource();

      this.salleClasseService
          .getSalleClasseByAnnee({
              annee_id: this._anneeService.activeAnnee.id,
          })
          .subscribe((data) => {
              this.listeSalle = data as SalleClasse[];
          });

      this.classeService
          .getAll()
          .subscribe((data) => {
              this.listeClasse = data as Classe[];
          });
  }

  filtreByClasse(classe_id) {
      this.classe_id = classe_id;
      this.salle_classe_id = 0;
      if(classe_id!=0)
      this.salleClasseService
          .getSalleClasseByAnneeAndClasse({
              annee_id: this._anneeService.activeAnnee.id,
              classe_id:classe_id
          })
          .subscribe((data) => {
              this.listeSalle = []
              this.listeSalle = data as SalleClasse[];
          });
      this._updateDataSource();
  }

  filtreBySalleClasse(salle_classe_id) {
      this.salle_classe_id = salle_classe_id;
      this._updateDataSource();
  }

  _updateDataSource() {
      this.data['actualiser2']=true;
      this._versementsService
          .getVersementByAnneeOrAllGroupeBy({
              annee_id: this._anneeService.activeAnnee.id,
              salle_classe_id: this.salle_classe_id,classe_id:this.classe_id
          })
          .subscribe((data) => {
            console.log(data)
              let data2 = data as InscriptionEleve[];
              console.log(data2)
              this.dataSource.data = data2;
              
      this.data['actualiser2']=false;
          },err=>{
              console.log(err)
      this.data['actualiser2']=false;
          });
  }
  // historiquePaiement
  
  historiquePaiement(inscriptionEleve: InscriptionEleve): void {
    console.log(inscriptionEleve)
        this.dialogRef = this._matDialog.open(HistoriquePaiementComponent, {
            data: {
                versementDataSearch:inscriptionEleve
            },
        });

  this.dialogRef.afterClosed().subscribe((response: any) => {
      if (!response) {
          return;
      }
      this._updateDataSource();
  });
}


affectation(inscriptionEleve:InscriptionEleve){
  
    this.dialogRef = this._matDialog.open(HistoriquePaiementComponent, {
        data: {
            inscriptionEleve: inscriptionEleve,
            action: 'edit',
        },
    });

  this.dialogRef.afterClosed().subscribe((response: any) => {
      if (!response) {
          return;
      }
      this._updateDataSource();
  });
}

imprimerliste(){
    
    if(this.classe_id==0){
        this._snackBar.open('Veuillez choisir une classe', 'Splash', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration:2000
            });
            return;
    }
    if(this.salle_classe_id<=0){
        
        this._snackBar.open('Veuillez choisir une salle de classe', 'Splash', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration:2000
            });
            return;
    };
  this.data['actualiser2']=true;
  this._versementsService
  .getVersementByAnneeOrAllGroupeByImpression({
      annee_id: this._anneeService.activeAnnee.id,
      salle_classe_id: this.salle_classe_id,classe_id:this.classe_id
  })
  .subscribe((data) => {
    console.log(data)
      this.data['actualiser2']=false;
      saveAs(data,`ETAT_SCOLARITE_ELEVE_SALLE_CLASSE${this.salle_classe_id}_${this._anneeService.activeAnnee.annee}.docx`);

  },err=>{this.data['actualiser2']=false;console.log(err)});
}
}
