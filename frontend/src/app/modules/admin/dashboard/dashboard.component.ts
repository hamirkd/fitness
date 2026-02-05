import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AbonneService } from 'app/core/services/abonne.service';
import { ApiService } from 'app/core/services/api.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentUser:any;
  svgContent!: SafeHtml;

  constructor(private _userService:UserService,
    
  private api: AbonneService,
  private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this._userService.user$.subscribe(user=>{this.currentUser=user;});
    this.refresh();
  }

  refresh() {
    this.api.getSvg().subscribe(svg => {
      console.log(svg)
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
    setTimeout(() => {
      this.refresh();
    }, 5000);
  }

}
