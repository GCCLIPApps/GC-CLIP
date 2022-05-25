import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  email: string = this._user.getEmail();
  profilepic = this._user.getProfileImage();

  constructor(private _user: UserService) { }

  ngOnInit(): void {
  }

  toggleSideBar(){
    this.toggleSidebarForMe.emit();
  }

  logOut(){
      this._user.setUserLogout();

  }
}
