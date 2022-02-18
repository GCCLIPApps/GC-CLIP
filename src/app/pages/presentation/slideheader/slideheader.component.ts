import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-slideheader',
  templateUrl: './slideheader.component.html',
  styleUrls: ['./slideheader.component.scss']
})
export class SlideheaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  fullname: string;
  email: string;
  constructor(private _user: UserService) { }

  ngOnInit(): void {
    this.email = this._user.getEmail();
  }

  toggleSideBar(){
    this.toggleSidebarForMe.emit();
  }
  playSlide(){
    
  }
}
