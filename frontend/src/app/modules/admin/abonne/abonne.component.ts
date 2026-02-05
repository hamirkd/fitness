import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbonneService } from 'app/core/services/abonne.service';
@Component({
    selector: 'app-abonne',
    templateUrl: './abonne.component.html',
    styleUrls: ['./abonne.component.scss'],
})
export class AbonneComponent implements OnInit,AfterViewInit {
     
    constructor(
        private _matDialog: MatDialog,private clientService: AbonneService
    ) {}

     
    ngAfterViewInit(){
        
      }
    recherche(textRecherche) {
       
    }

    ngOnInit(): void {  
    }  
  
}
