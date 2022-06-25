import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Animations } from 'src/app/animation';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { NotificationService } from 'src/app/services/notification.service';

import { MatDialogRef, MatDialog, MAT_DIALOG_DATA  } from '@angular/material/dialog';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';



import { Chart, registerables } from 'chart.js';
import { ChartConfiguration, ChartDataset, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';

var animates = new Animations()


export interface Viewers {
  image_fld: string;
  emailadd_fld: string;
  updatedOn: string;
  createdOn: string;
}



@Component({
  selector: 'app-studentpace',
  templateUrl: './studentpace.component.html',
  styleUrls: ['./studentpace.component.scss'],
  animations: [animates.fadeAnimation, animates.listAnimation]
})
export class StudentpaceComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
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
  isStudentdone: boolean = false;
  responseLists:  any =[];
  studentslists: any = []
  hasStart: any
  elem: any;
  code: string;
  image: string;
  sideBarOpen = true;
  id: any;

  isStart: boolean = false;
  setStart: boolean = false
  startWarning: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['no_fld', 'right_fld', 'wrong_fld', 'percentage_fld'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );


  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: true
        }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'>;

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private location: Location,
  private activatedRoute: ActivatedRoute,
  private breakpointObserver: BreakpointObserver, 
  private _sb: NotificationService,
  public _socket: SocketService,
  private _ds: DataService, 
  private _router: Router,
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
      // console.log(this.responseLists[0].totalResponse)
    }
    setTimeout(() =>{ this.isSpinner = true}, 2000);
  }

  ngOnInit(): void {
    this.getParams()
    this.getPresentation()
    this.getquizscoretally()
    this.Updatechart()
    this._socket.socketConnect()   
  }

   getParams(){
    this.activatedRoute.params.subscribe((params) => {
      this.id = { ...params['keys'], ...params };
      this.hasStart = atob(this.id.link)
      sessionStorage.setItem('code', String(atob(this.id.code)))
      });
  }

  async getPresentation(){
    this._ds.processData1(`slides/${sessionStorage.getItem('code')}`,'', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this._user.setPresentation(load.id, load.sCode_fld,load.sName_fld,load.sPace_fld, load.isQuiz_fld, load.isStarted_fld, load.isassigned_fld);
      this._user.setPresentationTheme(load.sTheme_fld, load.sColor_fld);
        
      this.presentationName = this._user.getPresentationName();
      this.sCode = this._user.getPresentationCode();
      this.sTheme = this._user.getPresentationTheme();
      this.sColor = this._user.getPresentationFontColor();
      this._socket.createRoom(this._user.getPresentationCode());
      this.presentationId = this._user.getPresentationId()
      

      if(this.hasStart === 'replay' || this.hasStart == 0){
        this.reloadPage()
        this.callStudentlobby()

      }else{
        this.setStart = true
        this.getFinalResult()
      }

    },err =>{
      // console.log('err', err)
    });
  }


  newTally: any = []
  label: any = []
  right: any = []
  wrong: any = []
  getquizscoretally(){
    this.newTally = []
    this.label = []
    this.right = []
    this.wrong = []
    this._ds.processData1('scores/scoretally/instructor', atob(this.id.code), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.newTally =load
      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
      

      this.Updatechart()
  
        
          },err =>{
        // console.log('err', err)
      });
  }

  public Updatechart(): void {

    

    for(let i = 0; this.newTally.length > i; i++){
      this.label.push(this.newTally[i].heading_fld)
      this.right.push(this.newTally[i].correct)
      this.wrong.push(this.newTally[i].wrong)
    
    }

    this.barChartData = {
      labels: this.label,
      datasets: [
        { data: this.wrong, label: 'Wrong', stack: 'a' },
        { data: this.right, label: 'Correct', stack: 'b' }
      ]
    };

    this.barChartData.datasets[0].data = this.wrong ;
    this.barChartData.datasets[1].data = this.right;
    this.chart?.update();
  }


  getFinalResult(){
    this._ds.processData1(`scores/getAllScores/${sessionStorage.getItem('code')}`, '', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log(load)

      this.studentFinalResults = load
      if(load.length){
        this.isStudentdone = true;
      }

      },err =>{
        // console.log('err', err)
      });
  }



  isStarted(){
    
    if(this.studentslists.length){
      this.isStart = true
      this.interval = setInterval(() => {
        if(this.countDown > 0) {
          // console.log(this.countDown)
          this.countDown--;
          if(this.countDown == 0){
            this.setStart = true;
            this.updateTitle(1)
            this.startRequest()
          }
        }
      },1000)

      this._socket.sendData({
        room: this._user.getPresentationCode(), 
        isStarted: true
      })
    }else{
      this.startWarning = 'Waiting for students before starting'
    }
  }
  
  viewFinalResult(){
    this._router.navigate([`/quiz/${btoa(String(this._user.getPresentationId()))}/${btoa('finalResult')}/result`])
  }

  reloadPage(){
    this.updateTitle(0)
  }

  // Pull of data
  startRequest(){
    this.interval = setInterval(() =>{ 
    //  this.getFinalResult()
    this.getquizscoretally()
    }, 5000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }


  copypaste(){
    this._sb.success("Code Copied");
   }

   returnpage(){
    Swal.fire({
      title: 'Are you sure?',
      text: "Leaving the lobby?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._socket.leaveRoom(this._user.getPresentationCode(), this._user.getFullname())
        this.location.back()
  
      }
    })
   }

   updateTitle(no: any){

    this._ds.processData1('slides/update/'+this._user.getPresentationId(),
    {sName_fld: this._user.getPresentationName(), 
      sTheme_fld: this._user.getPresentationTheme(), 
      sColor_fld: this._user.getPresentationFontColor(), 
      isassigned_fld: this._user.getPresentationAssignto(),
      sPace_fld: this._user.getPresentationPace(),
      isStarted_fld: no}, 2)?.subscribe((res: any) => {
    
      let load = this._ds.decrypt(res.d);
      this._user.setPresentationTheme(load.sTheme_fld,load.sColor_fld);
      this._user.setPresPace(load.sPace_fld);
      this._user.getPresentationNewPaceandisAssigned()
      },err =>{
        // console.log('err', err)
      });
  }

  viewers: any = [];
  dataSource = new MatTableDataSource<Viewers>();

  checkViewers(){
    this._ds.processData1('history/getSlideViewer', this._user.getPresentationId(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log('viewer',load);
      this.viewers = load
      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
      },err =>{
        // console.log('err', err)
      });``
  }

  callStudentlobby(){

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

         
          // for(let i = 0; i < this.studentslists.length; i++){
          //   if(data['name'] == this.studentslists[i].name){

          //     this.studentslists.splice(i, 1)
          //     this.studentslists.push(data)
          
          //     break;
          //   }else{

          //     this.studentslists.push(data)
          //     console.log(this.studentslists)
          //   }

          //   if(this.studentslists[i]['name'] == data['name']){

          //     this.studentslists.splice(i,1)
          //     this.studentslists.push(data)
          //   }else{
            // }
        // }
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
}