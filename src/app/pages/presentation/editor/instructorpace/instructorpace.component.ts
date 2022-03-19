import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { Animations } from 'src/app/animation';

import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { ResponseviewerComponent } from '../responseviewer/responseviewer.component';
var animates = new Animations()

@Component({
  selector: 'app-instructorpace',
  templateUrl: './instructorpace.component.html',
  styleUrls: ['./instructorpace.component.scss'],
  animations: [animates.fadeAnimation, animates.fadeAnimation]

})
export class InstructorpaceComponent implements OnInit {
  @Input() presentationData: any;
  @Input() showOptions: any;
  @Input() type: any;
  @Input() selectedImage: any;
  @Input() smallParagraph: any;
  @Input() status: any;
  @Input() isCardloading: boolean;
  @Input() isPresented: boolean;
  @Input() percent: number;

  elem: any;
  code: string;
  image: string;
  interval: any;
  totalNo:number = 0

  responseLists: any = 0;
  studentslists: any = []
  isSpinner: boolean = false;

  // heading: string
  @Input() sTheme:string = this._user.getPresentationTheme();
  @Input() sColor: string = this._user.getPresentationFontColor();

  @Output() isPressExit : EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private matDialog: MatDialog,
  private _snackBar: MatSnackBar,
  public _socket: SocketService,
  private _ds: DataService, 
  public _user: UserService) { 

  this.elem = document.getElementById("presentSlide");

}

  ngOnChanges(changes: any): void {
    this.isSpinner = false;
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // this.recieveData()
    if(this.type == 'paragraph' || this.type == 'bullet' || this.type == 'poll' || this.type == 'heading'){
      this.pauseTimer()
    }else{
      this.startRequest()    

    }
  
  }

  ngOnInit(): void {
    this._socket._socket.fromEvent('room-joined').subscribe((data:any) =>{
        this.studentslists.push(data)

        this._user.setNoStudents(this.studentslists)
        console.log(this._user.getNoStudents())
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
 
  
      this.code = this._user.getPresentationCode();
      this._socket.createRoom(this._user.getPresentationCode());
      setTimeout(() =>{ this.isSpinner = true}, 2000);
      this.startRequest()    

  }

  copypaste(){
    this._snackBar.open("Code Copied", '', {
       duration: 1000,
     });
   }

 
  recieveData(){
    this.image = this.presentationData.image_fld
  }

  setStart: boolean = false

  isStarted(){
    this.setStart = true;
    
    this._socket.sendData({
      room: this._user.getPresentationCode(), 
      isStarted: this.setStart
    })
  }

  @HostListener('window:keydown.esc', ['$event'],)
  pressKey(event:any){
    if (event.key === "Escape") {
      this.isPressExit.emit(true);
    }
  }

  getResponse(){
    this._ds.processData1('response/getAllResponseBysdId', this._user.getSlideId() , 2)?.subscribe((res: any) => {
        let load = this._ds.decrypt(res.d);
        this.responseLists = load;
        console.log('fullscreen response', this.responseLists)

          },err =>{
            console.log('err', err)
          });
  }

  startRequest(){
    this.interval = setInterval(() =>{ 
      this.getResponse()
      // console.log('fullscreen response', this.responseLists)
    }, 3000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}
