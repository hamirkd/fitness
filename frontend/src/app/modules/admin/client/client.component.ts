import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from 'app/core/services/client.service';
@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit,AfterViewInit {
     
    constructor(
        private _matDialog: MatDialog,private clientService:ClientService
    ) {}

     
    ngAfterViewInit(){
        
      }
    recherche(textRecherche) {
       
    }

    ngOnInit(): void {  
    }  
  
}
