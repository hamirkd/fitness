import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { VersementsService } from 'app/core/services/versements.service';
import { Versement } from 'app/models/versement.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment'

@Component({
  selector: 'app-historique-paiement',
  templateUrl: './historique-paiement.component.html',
  styleUrls: ['./historique-paiement.component.scss']
})
export class HistoriquePaiementComponent implements OnInit {

  displayedColumns: string[] = ['id', 'montant', 'createdAt'];
  versementDataSearch:any;//{inscription_id,annee_id,eleve,salleClasse,classe}={}

  dataSource: MatTableDataSource<Versement> = new MatTableDataSource();
  constructor(
    private _versementService: VersementsService,
    @Inject(MAT_DIALOG_DATA) _data: any,) {
      this.versementDataSearch = (_data.versementDataSearch); 
    }

  ngOnInit(): void {
    this.getHistoriqueVersement();
  }

  getHistoriqueVersement() {
      this._versementService.getAllBy(this.versementDataSearch).subscribe(
          (data) => { 
            console.log(this.versementDataSearch)
              this.dataSource.data = data as Versement[]; 
          },
          (err) => { this.dataSource.data = []
            console.log(err)
          }
      );
  }

  

  public downloadInvoice(){
    // https://github.com/MaxwellADN/jspdf-invoice-template/blob/master/src/app/app.component.ts#L12
    const doc =  new jsPDF('p', 'mm', 'a5');
    
    
    autoTable(doc, {
      body: [
        [
          {
            content: 'Reçu',
            styles: {
              halign: 'right',
              fontSize: 20,
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
      }
    });
    var img = new Image()
    img.src = 'assets/images/logo/logo.png'
    doc.addImage(img, 'jpeg', 15, 5, 25, 25)

    autoTable(doc, {
      body: [
        [{
              content: `Élève : #${this.versementDataSearch.matricule}`
              +`\nNom et Prénom(s) : ${this.versementDataSearch.nomprenom}`
              +`\nClasse : ${this.versementDataSearch.classe}`
              +`\nDate : ${moment(this.versementDataSearch.created_at).format('DD/MM/YYYY')}`,
              styles: {
                halign: 'left',
                lineColor:'#0000000',
                lineWidth:0.1
              }
            },
            {
              content: `Référence : #${this.versementDataSearch.inscription_id.toString().padStart(6,'0')}`
              +`\nDate : ${moment(new Date()).format('DD/MM/YYYY')}`,
              styles: {
                halign: 'right',
                lineColor:'#0000000',
                lineWidth:0.1
              }
            }
        ],
      ],
      theme: 'plain'
    });
 

    autoTable(doc, {
      body: [
        [
          {
            content: 'Paiement de frais de scolarité',
            styles: {
              halign:'left',
              fontSize: 14
            }
          }
        ]
      ],
      theme: 'plain'
    });
    let data = [];
     
      let somme = 0;
    for(let element of this.dataSource.data) {
      somme = somme + element.montant;
      data.push(['#'+element.id.toString().padStart(6,'0'),'Frais inscription & Scolarité',moment(element.dateversement).format('DD/MM/YYYY'),element.montant])
    }
    const restpaye = Number(this.versementDataSearch.scolarite.frais_inscription) +
      Number(this.versementDataSearch.affecte=="OUI"?this.versementDataSearch.scolarite.frais_scolarite_affecte:this.versementDataSearch.scolarite.frais_scolarite)-somme;

    autoTable(doc, {
      head: [['Réf.','Description','Date', 'Montant']],
      body: data,
      theme: 'grid',
      headStyles:{
        fillColor: '#343a40'
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Total payé:',
            styles:{
              halign:'right',
              fontSize: 14
            }
          },
          {
            content: `${somme} F. CFA`,
            styles:{
              halign:'right',
              fontSize:14,
              fontStyle:'bold'
            }
          },
        ],
        [
          {
            content: 'Reste à payé:',
            styles:{
              halign:'right',
              fontSize:14,
            }
          },
          {
            content: `${restpaye} F. CFA`,
            styles:{
              fontSize:14,
              halign:'right'
            }
          },
        ],
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Termes et remarques',
            styles: {
              halign: 'left',
              fontSize: 14
            }
          }
        ],
        [
          {
            content: 'Toute somme versée ne sera plus remboursable',
            styles: {
              halign: 'left'
            }
          }
        ],
      ],
      theme: "plain"
    });

    return doc.save("invoice");

  }

}
