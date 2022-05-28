import { Component, EventEmitter, OnInit, Output, Input, HostListener, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import {Subscription } from 'rxjs';
import { SlidemainComponent } from '../slidemain/slidemain.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseviewerComponent } from './responseviewer/responseviewer.component';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FullscreenviewComponent } from './fullscreenview/fullscreenview.component';
import { StudentpaceComponent } from './studentpace/studentpace.component';
import { InstructorpaceComponent } from './instructorpace/instructorpace.component';
import { Router } from '@angular/router';

export interface Presentations {
  sName_fld: string;
  updatedOn: string;
  createdOn: string;
}


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {


  @ViewChild(FullscreenviewComponent) fullscreencomponent: FullscreenviewComponent

  @Output() toSlideMain : EventEmitter<any> = new EventEmitter<any>();
  @Output() PaceandAssign : EventEmitter<any> = new EventEmitter<any>();
  
  @Output() Timer : EventEmitter<any> = new EventEmitter<any>();
  @Output() quizStart: EventEmitter<any> = new EventEmitter<any>();
  

  @Input() sTheme:string = this._user.getPresentationTheme();
  @Input() sColor: string = this._user.getPresentationFontColor();
  @Input() sImage: string = this._user.getPresentationFontColor();
  @Input() totalSelectAnswerPage: any;
  @Input() slideListPercent: any;



  percent: number;

  Owner : string = this._user.getFullname();
  elem: any;
  showSlide:boolean = false;
  isPresssedEnter: boolean = true;
  isPresented: boolean = false;
  isLastSlide: boolean = false;
  checkId: number;
  responseLists: any = [];
  countDown: number;
  slideTimer: number;
  totalPages: number;

  interval: any;
  // Slide Variables
  myArrayData = {}
  heading: string;
  subheading: string;
  paragraph: string;
  image: any;
  status: string = ""
  smallParagraph: string = ""
  showOptions: any;
  selectedImage: any;
  type: string;
  studentslists: any = []

  fullscreenRef: any;
  presentationData: any
  replay: any;
  // Component
  component: any ;

  constructor(
    private matDialog: MatDialog,
    public _socket: SocketService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _ds: DataService, 
    public _user: UserService) { }
    
  ngOnInit():void {
  
  }
  
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.isLastSlide = false;

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.isPresented){
      this._socket.leaveRoom(this._user.getPresentationCode(), this._user.getFullname())
    }
  }

  ngOnChanges(changes: any): any {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
      this.percent = this.slideListPercent;
  }
  
    


  toFullscreenview:any[];

  //Fetch Data rom RightNav 
  getcontentFrom(data:any, type: any, newOption: any){
 

    this.type = type.newType;
    if(this.type == 'qa' || this.type == 'poll'|| this.type == 'mc'){
      
    
        this.getResponse();
        
        if(this.responseLists == '0'){
          this.status =   "No response from the audience!"
          this.smallParagraph = "Incoming question will show up here so that you can answer them one by one";
        }

        this.myArrayData = {
          "heading_fld" : data.contentForm.heading,
          "subheading_fld" : data.contentForm.subheading,
          "image_fld": data.contentForm.image,
        }  
    }else if(this.type == 'quiz' || this.type == 'identification'){



        if (data.contentForm.isextrapoints){
          this.myArrayData = {
            "heading_fld" : data.contentForm.heading,
            "subheading_fld" : data.contentForm.subheading,
            "image_fld": data.contentForm.image,
            "isextrapoints_fld": data.contentForm.isextrapoints,
            "timer_fld": data.contentForm.timer
          }  
        }else{
          this.myArrayData = {
            "heading_fld" : data.contentForm.heading,
            "subheading_fld" : data.contentForm.subheading,
            "image_fld": data.contentForm.image,
            "points_fld": data.contentForm.point,
            "isextrapoints_fld": data.contentForm.isextrapoints,
            "timer_fld": data.contentForm.timer
          }  
        }
        this.timerToMain(data.contentForm.timer)

    }else{
          this.myArrayData = {
            "heading_fld" : data.contentForm.heading,
            "subheading_fld" : data.contentForm.subheading,
            "image_fld": data.contentForm.image,
          }  
    }
   
      this.heading = data.contentForm.heading;
      this.subheading = data.contentForm.subheading;
      this.image =  data.contentForm.image ;
      this.selectedImage = data.contentForm.selectedImage
      this.showOptions = newOption.options;

    this.updateContent();
    console.log(this.isPresented)
    if(this.isPresented){
      this.sendtoSocket();
      this.sendDatatoModals(status);

    }
  }

  getResponse(){
    // this.modalSubscription =  this._user.SubjectslideId?.subscribe((data) => {
      this._ds.processData1('response/getAllResponseBysdId', this._user.getSlideId() , 2)?.subscribe((res: any) => {
      let load = res;;
        this.responseLists = load;
        // console.log(this.responseLists)

      
          },err =>{
            // console.log('err', err)
          });
    // });
  }


  getOptions(){
    this._ds.processData1('poll/getPolls',this._user.getSlideId(), 2)?.subscribe((res: any) => {
  let load = res;;
    // console.log(load)
    this.fullscreenRef.componentInstance.showOptions = load;
    },err =>{
      // console.log('err', this._ds.decrypt(err.d))
    });
  }
  timerToMain(timer: number){
    this.slideTimer = timer
    // console.log(this.slideTimer)
  }

  updatePaceandAssignto(paceAssignto:any){
    // console.log(paceAssignto)
    this.PaceandAssign.emit(paceAssignto);
  }

  
  @HostListener('window:keydown.esc', ['$event'],)
  @HostListener('window:keydown.enter', ['$event'],)

  pressKey(event:any){
  
    this.countDown = 5;
    if (event.key === "Escape") {
      if(this.isPresented){
        this.showSlide = false;
        clearInterval(this.interval);
        this.isPresssedEnter = false;
        this.isPresented = !this.isPresented;
      }
    }

    if(event.key === "Enter"){
      this.isPresssedEnter = true; 
      this.quizStart.emit(this.isPresssedEnter);
      this.interval = setInterval(() =>{
        if(this.countDown > 0){
          this._socket.sendTimerCountdown( {countDown : this.countDown, room: this._user.getPresentationCode()})
          this.countDown--
        }else{
          this._socket.sendTimerCountdown( {countDown : this.countDown, room: this._user.getPresentationCode()})
          clearInterval(this.interval);
          this.showSlide = true
          this.slidecountDown()
        }
      }, 1000)

    }
  }

  slidecountDown(){
    this.interval =  setInterval(() => {
 
      if(this.slideTimer > 0){
        this._socket.sendTimerCountdown( {slideTimer : this.slideTimer, room: this._user.getPresentationCode()})
        this.slideTimer--
      }else{
        clearInterval(this.interval);
        this._socket.sendTimerCountdown( {slideTimer : this.slideTimer, room: this._user.getPresentationCode()})
      }
    },1000)

  }

  openFullscreen(status: string) {
    // console.log(this._user.getPresentationPace())
    if(this._user.getIsQuiz() && this._user.getPresentationPace() == 1){

      // if(this._user.getIsStarted()){

      //  this._router.navigate([`/quiz/${btoa(String(this._user.getPresentationId()))}/${btoa('finalResult')}/result`])

      // }else{
        if(status === 'replay'){
          this._router.navigate([`/quiz/${btoa(String(this._user.getPresentationId()))}/${btoa(status)}/start`])

        }else{
        this._router.navigate([`/quiz/${btoa(String(this._user.getPresentationId()))}/${btoa(String(this._user.getIsStarted()))}/start`])

        }

      // }
    }else{

      if(this._user.getIsQuiz() && this._user.getPresentationPace() == 0){

        this.component = InstructorpaceComponent;

      }else{
        this.component = FullscreenviewComponent
      }
      this.sendDatatoModals(status);
      this.isPresented = true
    } 
  }

  sendDatatoModals(status: string){

    if(this.isPresented){
      console.log('this works')

      this.sendtoSocket();
      this.fullscreenRef.componentInstance.presentationData = this.myArrayData
      this.fullscreenRef.componentInstance.showOptions =  this.showOptions
      this.fullscreenRef.componentInstance.type =  this.type
      this.fullscreenRef.componentInstance.percent =  this.percent
      this.fullscreenRef.componentInstance.status =  this.status
      this.fullscreenRef.componentInstance.smallParagraph =  this.smallParagraph
    }else{


      this.fullscreenRef = this.matDialog.open(this.component,{
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        panelClass: 'my-custom-dialog-class'
      });
      
  
  
      
      this.sendtoSocket();
      this.fullscreenRef.componentInstance.presentationData = this.myArrayData
      this.fullscreenRef.componentInstance.showOptions =  this.showOptions
      this.fullscreenRef.componentInstance.type =  this.type
      this.fullscreenRef.componentInstance.percent =  this.percent
      this.fullscreenRef.componentInstance.status =  this.status
      this.fullscreenRef.componentInstance.smallParagraph =  this.smallParagraph
  
  
      this.fullscreenRef.componentInstance.isPressExit.subscribe((result :any) => {
        if (result) {
          this.isPresented = false
        }
      });
  

    }
 

    if(this.type=='poll'){
      this.interval = setInterval(() =>{ 
        this.getOptions()
        // console.log('fullscreen response', this.responseLists)
      }, 3000);
    }else{
      clearInterval(this.interval)
    }
  }

  isCardloading = false;
  
  updateContent(){
    this.isCardloading = true;
    this.showSlide = false;
    this.isPresssedEnter = false;
 
    this._ds.processData1('contents/update/'+this._user.getContentId(), this.myArrayData, 2)?.subscribe((res: any) => {
    let load = res;;
        this.isCardloading = false;
        this.toSlideMain.emit({isSpin: true, type: this.type});
  
        },err =>{
          this.isCardloading = false;
          // console.log('err', err)
        });
  }


  sendtoSocket(){
    if(!(this.type === 'heading' || this.type === 'paragraph' || this.type === 'qa')){
      
      this._socket.sendData({
        room: this._user.getPresentationCode(), 
        slideId: this._user.getSlideId(), 
        type: this._user.getSlideType(), 
        slideData: this.myArrayData, 
        optionData:this.showOptions
      })
     }
     else{
      this._socket.sendData({
        room: this._user.getPresentationCode(), 
        slideId: this._user.getSlideId(), 
        type: this._user.getSlideType(), 
        slideData: this.myArrayData, 
        optionData: null})
     }
  }
}
