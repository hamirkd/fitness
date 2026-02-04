import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentUser:any;
  constructor(private _userService:UserService) { }

  ngOnInit(): void {
    this._userService.user$.subscribe(user=>{this.currentUser=user;})
  }

}
