import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  fullname: string = this._user.getFullname();
  department: string = this._user.getDept()
  version: string = this._user.appVersion
  profilepic: string = this._user.getProfileImage();

  constructor(public _user: UserService) { }

  ngOnInit(): void {

  }

}
