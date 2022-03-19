import { Injectable } from '@angular/core';
import { Router}  from '@angular/router';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { DataSchema } from '../data-schema';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  noImage: string = 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg'
  private keyString = new DataSchema();

  // User
  public apiLink: string = environment.apiLink
  public imageLink: string = environment.imageLink
  public webLink: string = environment.webLink

  private profilepic: string;
  private token: any;
  private empId: any;
  private email: string;
  private fname: string;
  private mname: string;
  private lname: string;
  private status: number;
  private dept: string;
  private program: string;
  private passwordchange: number;
  private isLoggedIn: boolean = false;

  // App Version
  public appVersion: string = "v1.0";

  // Presentation
  private presId: number;
  private presName: string;
  private presPace: number;
  private presCode: string;
  private presTheme: string;
  private presColor: string;
  private presIsQuiz: number;

  // Presentation Pages

  SubjectpresPace : Subject<any> = new Subject<any>();
  SubjectslideId : Subject<number> = new Subject<number>();

  private SlideId: number;
  private SlideNo: number;
  private SlideType: string;
  
  // Content

  private ContentId: number;

  constructor(private _cs: CookieService, private _router: Router, private _socket: SocketService) { 

  }

  getUserID(): number { return this.empId || this.session()[0] };
  getToken(): string { return this.token || this.session()[1] };
  getEmail(): string { return this.email};
  getFullname(): string {return this.fname+' '+this.mname+' '+ this.lname};
  getProfileImage(): string {return this.profilepic}
  getStatus(): number {return this.status};
  getDept(): string {return this.dept +' / '+ this.program};
  getPasswordChange(): number {return this.passwordchange};

  setUserLoggedIn(id:number, token: string, email:string, fname:string, mname: string, lname:string, status: number, dept: string, program: string,passwordchange: number, image: string){
    
    this.empId = id ;
    this.token = token;
    this.email = email;
    this.fname = fname;
    this.mname = mname;
    this.lname = lname;
    this.status = status;
    this.dept = dept
    this.program = program
    this.passwordchange = passwordchange;
    
    if(image){
      this.profilepic = this.imageLink + image;
    }else{
      this.profilepic = this.noImage;
    }

    this._cs.set(btoa('gcclipstatus'), btoa('true'))
  }

  session(){
    let decrypted = CryptoJS.AES.decrypt(this._cs.get(btoa('gcclipfaculty')), this.keyString.defaultmessage);
    let userData =  decrypted.toString(CryptoJS.enc.Utf8);

    this.fname = JSON.parse(userData).fname;
    this.mname = JSON.parse(userData).mname;
    this.lname = JSON.parse(userData).lname;
    this.email = JSON.parse(userData).email;
    this.status = JSON.parse(userData).status;
    this.dept = JSON.parse(userData).dept;
    this.program = JSON.parse(userData).program;
    this.passwordchange = JSON.parse(userData).passwordchange;

    if(JSON.parse(userData).profile){
      this.profilepic = this.imageLink + JSON.parse(userData).profile;
    }else{
      this.profilepic = this.noImage;
    }
    
    this.empId =  JSON.parse(userData).id;
    this.token = JSON.parse(userData).token;
    return [this.empId, this.token];
  }

  setUserLogout(){
    this.setUserLoggedIn(0,'','','','','',0,'','',0,'');
    this._cs.set(btoa('gcclipstatus'), '')
    this._cs.set(btoa('gcclipfaculty'), '')
    this._router.navigate(['']);
    this._socket.socketDisconnect();
  }

  isUserLoggedIn(): any { 
    return atob(this._cs.get(btoa('gcclipstatus')))
  }


  getPresentationId(): number { return this.presId }
  getPresentationCode(): string { return this.presCode }
  getPresentationName(): string { return this.presName }
  getIsQuiz(): number { return this.presIsQuiz }

  getPresentationNewPace(): any {  return this.SubjectpresPace.next(this.presPace)};
  getPresentationPace(): number {return this.presPace}
  getPresentationTheme(): string { return this.presTheme }
  getPresentationFontColor(): string { return this.presColor}

  setPresentation(id: number, code: string,sName: string, sPace: number, isQuiz: number){
    this.presId = id;
    this.presCode = code;
    this.presName = sName;
    this.presPace = sPace;
    this.presIsQuiz = isQuiz
  }

  setPresPace(sPace: number){
    this.presPace = sPace
  }
  
  setPresentationTheme(sTheme: string, sColor: string){

    this.presColor = sColor;

    if (!sTheme){
      this.presTheme = 'white';
    }else{
      this.presTheme = sTheme;
    }
  
  }

  SubjectSlideId(): any {  return this.SubjectslideId.next(this.SlideId)};
  getSlideId(): number { return this.SlideId };             
  getSlideNo(): number {return this.SlideNo};
  getSlideType(): string {return this.SlideType};

  setSlideDetails(id: number, sNo: number, sType: string){
    this.SlideId = id;
    this.SlideNo = sNo;
    this.SlideType = sType;
  }


  getContentId(): number { return this.ContentId};
  
  setContentDetails(id: number){
    this.ContentId = id
  }

  studentsLists: any = []

  setNoStudents(student: any){
    this.studentsLists = student
  }
  
  getNoStudents():any { return this.studentsLists}

}