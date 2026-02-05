import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AbonneService } from 'app/core/services/abonne.service';
import { Abonne } from 'app/models/abonne.model';
import { AddAbonneComponent } from '../add-abonne/add-abonne.component';
import { TranslateService } from '@ngx-translate/core';

import * as FileSaver from 'file-saver';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
    selector: 'app-list-abonne',
    templateUrl: './list-abonne.component.html',
    styleUrls: ['./list-abonne.component.scss'],
})
export class ListAbonneComponent implements OnInit,AfterViewInit {
    
  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator : MatPaginator;
    constructor(
                private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,private abonneService:AbonneService,
    ) {}

    searchControl: FormControl = new FormControl();

    dialogRef: any;
    dataSource: MatTableDataSource<Abonne> = new MatTableDataSource();
    pageSize = 20;

    displayedColumns: string[] = [
        'id',
        'nomprenom',
        'genre',
        'cnib',
        'telephone',
        'email',
        'actions',
    ];

    ngAfterViewInit(){
        if(localStorage.getItem("AbonnepageSize")){
            this.pageSize = JSON.parse(localStorage.getItem("AbonnepageSize"))
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    recherche(textRecherche) {
        textRecherche = textRecherche.trim(); // Remove whitespace
        textRecherche = textRecherche.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = textRecherche;
    }

    ngOnInit(): void { 
        this._updateDataSource();
    }

    ajouter(): void
    {
        this.dialogRef = this._matDialog.open(AddAbonneComponent, {
            panelClass: 'w-full',
            data      : {
                abonne:{},
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
    
    _updateDataSource(){
        this.abonneService.getAlls().subscribe(data=>{
            this.dataSource.data = data as Abonne[];
            this.dataSource.data.forEach(abonne => abonne['nomprenom'] = abonne.nom + ' ' + abonne.prenom)
        })
    }

    editer(element){
      this.dialogRef = this._matDialog.open(AddAbonneComponent, {
        panelClass: 'w-full',
        data      : {
            abonne:new Abonne(element),
            action: 'update'
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
    
    exporter(){
        if(!this.dataSource.data||this.dataSource.data.length==0){
        
        return;
        }
  
       // var blob = new Blob([this.convertToCSV(this.dataSource.data)], {type: "text/csv;charset=iso-8859-1"});
        var blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), new TextEncoder().encode(this.convertToCSV(this.dataSource.data))], { type: "text/csv;charset=iso-8859-1" });

        FileSaver.saveAs(blob, "Liste du abonne" +".csv");
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
    supprimer(element){
        this.dialogRef = this._fuseConfirmationService.open({
            title: 'Suppression abonne',
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
                'Voulez-vous supprimer le abonne N ' + element.id + ' ?',
        });

        this.dialogRef.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                //***DELETE ONE */
                this.abonneService.delete(element).subscribe((data) => {
                });
            }
        });
    }
    handlePageEvent(e: PageEvent) {
        // this.pageEvent = e;
        // this.length = e.length;
        this.pageSize = e.pageSize;
        localStorage.setItem("AbonnepageSize",JSON.stringify(e.pageSize));
        // this.pageIndex = e.pageIndex;
      }
}
