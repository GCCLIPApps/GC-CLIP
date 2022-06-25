import { Component, OnInit,ViewChild,Optional } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';
import { NotificationService } from 'src/app/services/notification.service';
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
  isStarted: boolean = false;
  showSpinner: boolean = false;
  isQuiz: boolean = false;

  sImage: string = ''
  studentslists: any = [
    {
      name: '',
      code: ''
    }
  ]


  email: string = this._user.getEmail();
  profilepic = this._user.getProfileImage();
  paceassignto: any;
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
    private _sb: NotificationService ,
    private _user: UserService,
    private _ds: DataService) {

     }




  ngOnInit():void{   
    this.getParams()
    this.getPresentation();
    this._socket.socketConnect(); 

    }

    getParams(){
      this.activatedRoute.params.subscribe((params) => {
        this.id = { ...params['keys'], ...params };
    
        if(this.id.code=='editor'){
          this.activatedRoute.queryParams.subscribe(params => {
            // console.log(params['link'])
            let url = params['link'];
            url = url.split("/").pop()
        
            this.id = Number(atob(url));
          
            this._route.events
          });
        }
      });
    }

  async getPresentation(){
    this._ds.processData1('slides/'+this.id,'', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this._user.setPresentation(load.id, load.sCode_fld,load.sName_fld,load.sPace_fld, load.isQuiz_fld, load.isStarted_fld, load.isassigned_fld);
      this._user.setPresentationTheme(load.sTheme_fld, load.sColor_fld);
      this.presentationName = this._user.getPresentationName();
      this.sCode = this._user.getPresentationCode(); this.sTheme = this._user.getPresentationTheme(); this.sColor = this._user.getPresentationFontColor();
      this._user.getPresentationNewPaceandisAssigned();
      this._socket.createRoom(this.sCode);

      this.paceassignto =  {
        pace: this._user.getPresentationPace(),
        toggleAssign:  this._user.getPresentationAssignto()
      };
     

      if(this._user.getIsQuiz() && this._user.getIsStarted()){
        this.isStarted = true
      }
 
      if(!this._user.getIsQuiz()){
        this.callSocket()
      }

    },err =>{
      // console.log('err', err)
    });
  }

   callSocket(){
    this._socket._socket.fromEvent('room-joined').subscribe((data:any) =>{

      this._sb.success(data['name'] + ' Joined the room')
    
        if(this.studentslists.length === 0){
              
          this.studentslists.push(data)


        }else{

          var res = this.studentslists.filter((p: any, i: any) => {

            if(p.name == data['name']){

              this.studentslists.splice(i, 1)

            }

          })
    
        this.studentslists.push(data)

      }

    })

    this._socket._socket.fromEvent('room-exited').subscribe((data:any) =>{
      
      for (var i = 0; i <  this.studentslists.length; i++){
        if (this.studentslists[i]['user']  == data['user']){
          this._sb.success(this.studentslists[i]['user'] + ' Left the room');
          this.studentslists.splice(i,1)
            break;
        }
      }
    })
  }

  updateTitlePaceAssign(PaceandAssign:any){
    var isAssign;
    if(PaceandAssign.toggleAssign){
      isAssign = 1
      this._user.setPresAssignto(1)

    }else{
      isAssign = 0
      this._user.setPresAssignto(0)
    }

    let jsonData = {sName_fld: this.presentationName, 
      sTheme_fld: this.sTheme, 
      sColor_fld: this.sColor, 
      sPace_fld: PaceandAssign.pace,
      isassigned_fld: isAssign,
      isQuiz_fld: this._user.getIsQuiz(),
      isStarted_fld: this._user.getIsStarted()
      }

    this.showSpinner = true;
    this._ds.processData1('slides/update/'+this._user.getPresentationId(), jsonData, 2)?.pipe(finalize(() => this.showSpinner = false))?.subscribe((res: any) => {
      
      let load = this._ds.decrypt(res.d);
      this._user.setPresentationTheme(load.sTheme_fld,load.sColor_fld);
      this._user.setPresPace(load.sPace_fld);
      this._user.getPresentationNewPaceandisAssigned()
      },err =>{
        // console.log('err', err)
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
   this._sb.success("Code Copied");
  }


  setTheme(){
    let dialogConfig = this.matDialog.open(ThemesComponent,{width: '50%', height:'auto',});

    dialogConfig.componentInstance.mainOutput.subscribe((result) => {

      // console.log('The dialog was closed', result);
      this.sTheme = result.backgroundColor;
      this.sColor = result.color;
      this.sImage = result.backgroundImage
      this.updateTitlePaceAssign(this.paceassignto);
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
  
  gotoResult(){
    this._route.navigate([`/quiz/${btoa(String(this._user.getPresentationId()))}/${btoa('finalResult')}/result`])
  }
}
