import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user_id :string = this._user.getUserID()
  fullname: string = this._user.getFullname();
  email: string = this._user.getEmail();
  department: string = this._user.getDept()
  version: string = this._user.appVersion
  profilepic: string = this._user.getProfileImage();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );


  constructor( private breakpointObserver: BreakpointObserver, private _user: UserService) { }

  ngOnInit(): void {
  }

}
