import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AbonneService } from 'app/core/services/abonne.service';
import { ApiService } from 'app/core/services/api.service';
import { UserService } from 'app/core/user/user.service';
import { AddAbonnementComponent } from '../facturation/add-abonnement/add-abonnement.component';
import { FormGroup } from '@angular/forms';
import { EchoService } from 'app/core/services/echo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentUser:any;
  svgContent!: SafeHtml;
  dialogRef: any;
  notifications = [];

  constructor(private _userService:UserService,
    private _matDialog: MatDialog,
    private echoService: EchoService) { }

  ngOnInit(): void {
    this._userService.user$.subscribe(user=>{
      this.currentUser=user;
      // this.echoService.echo
      // .private('fitness-checkin')
      // .listen('.abonne.checked', (e: any) => {
      //   console.log('e',e)
      //   this.notifications.unshift(e.abonne);
      //   this.playSound(e.status);
      // });
    });
  }
  playSound(status: string) {
    const audio = new Audio(status === 'OK' ? 'assets/ok.mp3' : 'assets/ko.mp3');
    audio.play();
  }

  ajouterButton() {
    this.dialogRef = this._matDialog.open(AddAbonnementComponent, {
      panelClass: 'w-1/2',
      data: {
        abonnement: {},
        action: 'new'
      },
      disableClose: true
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
      });
  }

}
