import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { Animations } from 'src/app/animation';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogPosition, MatDialog } from '@angular/material/dialog';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import Swal from 'sweetalert2'
import { Chart,registerables } from 'chart.js';

var animates = new Animations()


@Component({
  selector: 'app-studentpace',
  templateUrl: './studentpace.component.html',
  styleUrls: ['./studentpace.component.scss'],
  animations: [animates.fadeAnimation, animates.listAnimation]
})
export class StudentpaceComponent implements OnInit {
  @Input() sTheme:string = this._user.getPresentationTheme();
  @Input() sColor: string = this._user.getPresentationFontColor();
  @Output() isPressExit : EventEmitter<any> = new EventEmitter<any>();
  presentationName: string; 
  sCode: string

  isSpinner: boolean = false;

  countDown: number = 5;
  interval: any;
  presentationId: number = 0
  totalNo:number = 0
  studentFinalResults: any = []
  isStudentdone: boolean = true;
  responseLists:  any =[];
  studentslists: any = [{
    name: 'sadsadsa'
  }]
  chart: any = [];
  viewresult: any
  elem: any;
  code: string;
  image: string;
  sideBarOpen = true;
  id: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)

  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
  private location: Location,
  private activatedRoute: ActivatedRoute,
  private breakpointObserver: BreakpointObserver, 
  private matDialog: MatDialog,
  private _snackBar: MatSnackBar,
  public _socket: SocketService,
  private _ds: DataService, 
  public _user: UserService) { 
    
    Chart.register(...registerables)

  }

  ngOnChanges(changes: any): void {
    this.isSpinner = false;
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // this.recieveData()

    if(this.responseLists[0].totalResponse != '0'){
    }else{
      this.responseLists[0].totalResponse = 0
      console.log(this.responseLists[0].totalResponse)
    }
    setTimeout(() =>{ this.isSpinner = true}, 2000);
  }

  ngOnInit(): void {
    this._socket._socket.fromEvent('recieved-student-response').subscribe((data: any) =>{
      // this.responseLists.push(data)

    });
    
    this.activatedRoute.params.subscribe((params) => {
      this.id = { ...params['keys'], ...params };
   
      this.viewresult = atob(this.id.link)
      this.id = Number(atob(this.id.code))

   
        this.getPresentation()

        if(this.viewresult === 'finalResult'){
            this.setStart = true
            this.getFinalResult()
        }else{
          this._socket.socketConnect()
        }
 
  

      });

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
      });
  }

  getPresentation(){
    this._ds.processData1('slides/'+this.id,'', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this._user.setPresentation(load.id, load.sCode_fld,load.sName_fld,load.sPace_fld, load.isQuiz_fld);
      this._user.setPresentationTheme(load.sTheme_fld, load.sColor_fld);
      this.presentationName = this._user.getPresentationName();
      this.sCode = this._user.getPresentationCode();
      this.sTheme = this._user.getPresentationTheme();
      this.sColor = this._user.getPresentationFontColor();
      this._socket.createRoom(this._user.getPresentationCode());
      this.presentationId = this._user.getPresentationId()
    },err =>{
      console.log('err', err)
    });
  }


  getFinalResult(){
    this._ds.processData1(`scores/getAllScores/${this.id}`, '', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);

      this.studentFinalResults = load

      if(load.length){
        this.isStudentdone = false;
      }

      },err =>{
        console.log('err', err)
      });
  }






  isStart: boolean = false;
  setStart: boolean = false
  startWarning: string = '';

  isStarted(){
    
    if(this.studentslists.length){
      
      new Chart('myChart', {
        type: 'bar',
        data: {
          labels: ['Finished', 'Approved', 'Pending', 'Cancelled'],
          datasets: [{
            label: 'Appointments Status Analytics',
            data: [40, 10, 20],
            backgroundColor: [
              'rgba(43, 46, 74, .7)',
              'rgba(63, 191, 63, .7)',
              'rgba(161, 191, 63, .7)',
              'rgba(255, 74, 71, .7)',
            ],
            borderColor: [
              'rgba(43, 46, 74, 0.8)',
              'rgba(63, 191, 63, .7)',
              'rgba(161, 191, 63, .7)',
              'rgba(255, 74, 71, .7)',
            ],
            barPercentage: .5
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
          },
          responsive: false,
        }
      });
      this.isStart = true
      this.interval = setInterval(() => {
        if(this.countDown > 0) {
          console.log(this.countDown)
          this.countDown--;
          if(this.countDown == 0){
            this.setStart = true;
            this.updateTitle(this._user.getPresentationPace())
            this.startRequest()
          }
        }
      },1000)

      this._socket.sendData({
        room: this._user.getPresentationCode(), 
        isStarted: true
      })
    }else{
      this.startWarning = 'Waiting to players before starting'
    }
  

    
  }
  copypaste(){
    this._snackBar.open("Code Copied", '', {
       duration: 1000,
     });
   }

   returnpage(){
    Swal.fire({
      title: 'Are you sure?',
      text: "Leaving the room?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.location.back()
      }
    })
   }

   updateTitle(pace:number){
    this._ds.processData1('slides/update/'+this._user.getPresentationId(),
    {sName_fld: this.presentationName, 
      sTheme_fld: this.sTheme, 
      sColor_fld: this.sColor, 
      sPace_fld: pace || this._user.getPresentationPace(),
      isStarted_fld: 1}, 2)?.subscribe((res: any) => {
    
      let load = this._ds.decrypt(res.d);
      this._user.setPresentationTheme(load.sTheme_fld,load.sColor_fld);
      this._user.setPresPace(load.sPace_fld);
      this._user.getPresentationNewPace()
      },err =>{
        console.log('err', err)
      });
  }
 


 
  
  startRequest(){
    this.interval = setInterval(() =>{ 
     this.getFinalResult()
    }, 3000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}