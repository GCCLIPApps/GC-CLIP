import { Component, OnInit,ViewChild,Optional } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';  

import { SlidelistComponent } from '../slidelist/slidelist.component';
import { EditorComponent } from '../editor/editor.component';
import { ThemesComponent } from './themes/themes.component';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-slidemain',
  templateUrl: './slidemain.component.html',
  styleUrls: ['./slidemain.component.scss']
})
export class SlidemainComponent implements OnInit {
  @ViewChild(EditorComponent) editor: EditorComponent;
  @ViewChild(SlidelistComponent) slidelist: SlidelistComponent;
  
  id: any;
  presentationName: string ;
  sCode: string;
  sTheme: string;
  sColor: string;
  slidePercent: number;
  totalSelectAnswerPage: number = 0;
  slideTimer: number

  showSpinner: boolean = false;
  isQuiz: boolean = false;

  sImage: string = ''
  studentslists: any = [];


  email: string = this._user.getEmail();
  profilepic = this._user.getProfileImage();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private titleService: Title,
    private _route: Router,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    @Optional() public MatDialogRef: MatDialogRef<ThemesComponent>,
    private matDialog: MatDialog,
    private _socket: SocketService,
    private _snackBar: MatSnackBar,
    private _user: UserService, 
    private _ds: DataService) {

      this.activatedRoute.params.subscribe((params) => {
        this.id = { ...params['keys'], ...params };
  
        if(this.id.code=='editor'){
          this.activatedRoute.queryParams.subscribe(params => {
            // console.log(params['link'])
            let url = params['link'];
            url = url.split("/").pop()
            this.id = Number(atob(url));
            this.getPresentation();
          });
          }
        });


      this._route.events
     }




  ngOnInit(): void {
      this.callSocket();
    }

  getPresentation(){
    this._ds.processData1('slides/'+this.id,'', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
    
      this._user.setPresentation(load.id, load.sCode_fld,load.sName_fld,load.sPace_fld);
      console.log(this._user.getPresentationPace())

      this._user.setPresentationTheme(load.sTheme_fld, load.sColor_fld);
      this.presentationName = this._user.getPresentationName();
      this.sCode = this._user.getPresentationCode();
      this.sTheme = this._user.getPresentationTheme();
      this.sColor = this._user.getPresentationFontColor();


    },err =>{
      console.log('err', err)
    });
  }

  callSocket(){
    this._socket._socket.fromEvent('room-joined').subscribe((data:any) =>{
      this.studentslists.push(data)

      this._snackBar.open(this.studentslists[this.studentslists.length - 1]['user'] + ' Joined the room', '', {
        duration: 3000,
      });
    }) 

    this._socket._socket.fromEvent('room-exited').subscribe((data:any) =>{
      
      for (var i = 0; i <  this.studentslists.length; i++){
        if (this.studentslists[i]['user']  == data['user']){
          this._snackBar.open(this.studentslists[i]['user'] + ' Left the room', '', {
            duration: 3000,
          });
          this.studentslists.splice(i,1)
            break;
        }
      }
    })
  }
  
  updateTitle(pace:string){
    this.showSpinner = true;
    this._ds.processData1('slides/update/'+this._user.getPresentationId(),
    {sName_fld: this.presentationName, 
      sTheme_fld: this.sTheme, 
      sColor_fld: this.sColor, 
      sPace_fld: pace}, 2)?.pipe(finalize(() => this.showSpinner = false))?.subscribe((res: any) => {
    
      let load = this._ds.decrypt(res.d);
      this._user.setPresentationTheme(load.sTheme_fld,load.sColor_fld);
      this._user.setPresPace(load.sPace_fld);
      this._user.getPresentationNewPace()
      },err =>{
        console.log('err', err)
      });
      
  }

  renderSpinner(isSpin: boolean, type: any){

    this.slidelist.updateType(type.type);
    this.showSpinner = true;
    setTimeout(() =>{
      this.showSpinner = false;
    }, 1000);
  }

  copypaste(){
   this._snackBar.open("Code Copied", '', {
      duration: 1000,
    });
  }


  setTheme(){
    let dialogConfig = this.matDialog.open(ThemesComponent,{width: '50%', height:'auto',});

    dialogConfig.componentInstance.mainOutput.subscribe((result) => {

      console.log('The dialog was closed', result);
      this.sTheme = result.backgroundColor;
      this.sColor = result.color;
      this.sImage = result.backgroundImage
      this.updateTitle('');
    });
  }
  
  countDowntime($event: any){
    this.slideTimer = $event
  }

  slidesPercentage(percent: any, slidelist: any){
    this.slidePercent = percent.percent;
    this.totalSelectAnswerPage = slidelist.slidetype;
 
  }

  isquizStart($e: any){
    this.isQuiz = $e
  }
}
