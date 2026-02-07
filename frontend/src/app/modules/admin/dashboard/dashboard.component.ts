import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AbonneService } from 'app/core/services/abonne.service';
import { ApiService } from 'app/core/services/api.service';
import { UserService } from 'app/core/user/user.service';
import { AddAbonnementComponent } from '../facturation/add-abonnement/add-abonnement.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentUser:any;
  svgContent!: SafeHtml;
  dialogRef: any;

  constructor(private _userService:UserService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this._userService.user$.subscribe(user=>{this.currentUser=user;});
  }

  ajouterButton() {
    this.dialogRef = this._matDialog.open(AddAbonnementComponent, {
      panelClass: 'w-1/3',
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
