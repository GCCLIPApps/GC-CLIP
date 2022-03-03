import { Component, EventEmitter, OnInit, Output, Input, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import {Subscription } from 'rxjs';
import { SlidemainComponent } from '../slidemain/slidemain.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseviewerComponent } from './responseviewer/responseviewer.component';


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
  @Output() toSlideMain : EventEmitter<any> = new EventEmitter<any>();
  @Output() Pace : EventEmitter<any> = new EventEmitter<any>();
  @Output() Timer : EventEmitter<any> = new EventEmitter<any>();

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
  responseLists: any = [];;
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
  status: string = '';
  smallParagraph: string =''
  showOptions: any;
  selectedImage: any;
  type: string;
  constructor(
    private matDialog: MatDialog,
    public _socket: SocketService,
    private _snackBar: MatSnackBar,
    private _ds: DataService, 
    public _user: UserService) { }
    
  ngOnInit():void {
    this._socket.socketConnect();
    this.elem = document.getElementById("presentSlide");
    
    this._socket._socket.fromEvent('recieved-student-response').subscribe(data =>{
      this.responseLists.push(data)
      
      // this.getResponse();
    });


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
      this._socket.leaveRoom(this._user.getPresentationCode())
    }
  }

  ngOnChanges(changes: any): any {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
      this.percent = this.slideListPercent;
  }
  
  //Fetch Data rom RightNav 
  getcontentFrom(data:any, type: any, newOption: any){

    this.type = type.newType;
    console.log(this.type)

    switch (this.type) {
      case 'qa':
  
              if(this.responseLists.length){
                this.status =  ""
                this.smallParagraph = "";
              }else{
                this.status =  "No Response from the audience!"
                this.smallParagraph = "Incoming question will show up here so that you can answer them one by one";
              }

              this.myArrayData = {
                "heading_fld" : data.contentForm.heading,
                "subheading_fld" : data.contentForm.subheading,
                "image_fld": data.contentForm.image,
              }  
        break;

      case 'quiz':
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


        break;
        
      default:
              this.myArrayData = {
                "heading_fld" : data.contentForm.heading,
                "subheading_fld" : data.contentForm.subheading,
                "image_fld": data.contentForm.image,
              }  
        break;
    }

      this.heading = data.contentForm.heading;
      this.subheading = data.contentForm.subheading;
      this.image =  data.contentForm.image ;
      this.selectedImage = data.contentForm.selectedImage
      this.showOptions = newOption.options;


 
    this.getResponse();
    this.updateContent();
 
    if(this.isPresented){
         this.sendtoSocket();
    }
  }


  timerToMain(timer: number){
    this.slideTimer = timer
    console.log(this.slideTimer)
  }

  updatePace(pace:number){
    this.Pace.emit(pace);
  }
  
  showResponse(messge:any){

    const dialogRef = this.matDialog.open(ResponseviewerComponent,{
      data:{
        msg: messge
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
          // this.dataSource.data.splice(index, 1);
          // this.dataSource._updateChangeSubscription();
          // this._snackBar.open("Presentation Deleted", '', {
          //   duration: 2000,
          // });
      }
    });
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

  openFullscreen() {
    if(!this.isPresented){
      this.isPresented = true;
      this.isPresssedEnter = false;
      this._socket.createRoom(this._user.getPresentationCode());
      this.sendtoSocket();

      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    }
  }

  isCardloading = false;
  
  updateContent(){
    this.isCardloading = true;
    this.showSlide = false;
    this.isPresssedEnter = false;
 
    this._ds.processData1('contents/update/'+this._user.getContentId(), this.myArrayData, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
        this.isCardloading = false;
        this.toSlideMain.emit({isSpin: true, type: this.type});
  
        },err =>{
          this.isCardloading = false;
          console.log('err', err)
        });
  }
  
  getResponse(){
    // this.modalSubscription =  this._user.SubjectslideId?.subscribe((data) => {
      this._ds.processData1('response/getAllResponseBysdId', this._user.getSlideId() , 2)?.subscribe((res: any) => {
        let load = this._ds.decrypt(res.d);
        this.responseLists = load;
        
        // console.log(this.responseLists)
          // this._snackBar.open("Presentation Updated", '', {
          //   duration: 1000,
          // });
          },err =>{
            console.log('err', err)
          });
    // });
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
