import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';

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

  presCount: number = 0;
  quizCount: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );


  constructor( private breakpointObserver: BreakpointObserver, private _user: UserService, private _ds: DataService) { }

  ngOnInit(): void {
    this.getInstructorTotalQuiz()
    this.getInstructorTotalPres()
  }

  getInstructorTotalQuiz(){
    this._ds.processData1(`slides/byUserId/${1}`, this._user.getUserID(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.quizCount = load.length
      // console.log(this.quizCount)

      },err =>{
        // console.log('err', err)
      });
  }

  getInstructorTotalPres(){
    this._ds.processData1(`slides/byUserId/${0}`, this._user.getUserID(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.presCount = load.length

      
      },err =>{
        // console.log('err', err)
      });
  }

}
