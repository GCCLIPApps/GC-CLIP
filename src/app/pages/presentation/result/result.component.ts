import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudentresultComponent } from 'src/app/dialogs/studentresult/studentresult.component';

import { Chart, registerables } from 'chart.js';
import { ChartConfiguration, ChartDataset, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';



export interface Viewers {
  image_fld: string;
  emailadd_fld: string;
  updatedOn: string;
  createdOn: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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

  id: any;
  viewresult: string;
  viewers: any = [];
  interval: any;
  studentslists: any = 0;
  totalQuizPages: any = 0 
  dataSource = new MatTableDataSource<Viewers>();
  studentFinalResults: any = []
  displayedColumns1: string[] = ['name_fld', 'email_fld', 'right_fld', 'wrong_fld','points_fld','time_fld'];
  displayedColumns: string[] = ['no_fld', 'question_fld', 'right_fld','percentage_right_fld', 'wrong_fld', 'percentage_wrong_fld'];


  ImageLink = this._user.imageLink;
  currentTabIndex = 0

  sColor: string;
  sTheme: string;
  title: string;
  date: any;
  value: string;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );


  constructor(  private location: Location,
    private matDialog: MatDialog ,
    private activatedRoute: ActivatedRoute,
    private _route: Router,
    private breakpointObserver: BreakpointObserver,  
    private _ds: DataService, 
    public _user: UserService,
    ) {

      Chart.register(...registerables)
     }

  ngOnInit(): void {
    this.getParams()
   
  }


  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  // Return to dashboard
  returnpage(){
    this._route.navigate(['main/app'])
  }
  // Search in tables
  searchThis(){
    this.value = ""
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.value.trim().toLocaleLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Triggers when click mat tab group

  onTabChange(event: any) {

    if(event.index == 0  || event.index == 2){
      this.getquizscoretally()

    }else{
      // this.getallata()3
      // this.checkViewers()
      this.getParticipantsResult(Number(atob(this.id.code)))
    }
  }

  // Opens new tab in view quiz
  viewEditor(){
    this._route.navigate([]).then(result => {  window.open( `${this._user.webLink}editor?link=${btoa(this._user.webLink)}/${btoa(String(this._user.getPresentationId()))}`); });
  }

  //Get code in url
  getParams(){
    this.activatedRoute.params.subscribe((params) => {
      this.id = { ...params['keys'], ...params };
      this.viewresult = atob(this.id.link)
      let code = Number(atob(this.id.code))
        if(this.viewresult === 'finalResult'){
       
          this.getquizscoretally()
          this.getPresentation(code)
          this.getParticipantsResult(code)
        }
      });
  }

  // Get Presentations
  getPresentation(id: number){



    this._ds.processData1(`slides/${id}`,'', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);

      this._user.setPresentation(load.id, load.sCode_fld,load.sName_fld,load.sPace_fld, load.isQuiz_fld, load.isStarted_fld, load.isassigned_fld);
      this._user.setPresentationTheme(load.sTheme_fld, load.sColor_fld);
      this.title = this._user.getPresentationName()
      this.sTheme = this._user.getPresentationTheme();
      this.sColor = this._user.getPresentationFontColor();
      this.date = load.createdOn
      this.getStudents()
      this.getquizpagecount()
      

    },err =>{
      // console.log('err', err)
    });
  }

  // Get Participants in participants tab
  getParticipantsResult(id: number){
    this._ds.processData1(`scores/getAllScores/${id}`, '', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log(load)

      // this.studentFinalResults = load
      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
      },err =>{
        // console.log('err', err)
      });
  }
  newTally: any = []
  label: any = []
  right: any = []
  wrong: any = []

  // Get data for Overview and Questions tab
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

  // Renders new data in bar chart
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

 // Get Total Number of Student Viewed the quiz
  getStudents(){
    this._ds.processData1('history/getSlideViewer', this._user.getPresentationId(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log('viewer',load);
      this.studentslists = load

      },err =>{
        // console.log('err', err)
      });
  }

  // Get Total Page Count
  getquizpagecount(){
    this._ds.processData1('slides/pres/getquizcount/quiz',{ sId: this._user.getPresentationId(), quiz: 'quiz',identify: 'identification'}, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.totalQuizPages = load
        
    },err =>{
        // console.log('err', err)
    });``
  }

  // getallData(){
  //   this._ds.processData1('scores/allstudData/student', {sId: Number(atob(this.id.code)), accountno: this._user.getUserID()}, 2)?.subscribe((res: any) => {
  //     let load = this._ds.decrypt(res.d);

  //     this.dataSource = new MatTableDataSource(load); 
  //     this.dataSource.sort = this.sort;
  //       console.log(load)
  //         },err =>{
  //       // console.log('err', err)
  //     });``
  // }

  // Time Interval
  startRequest(){
    this.interval = setInterval(() =>{ 
      this.getParticipantsResult(Number(atob(this.id.code)))
      this.getquizscoretally()
    }, 2000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  // View specific student data in participants
  viewStudentResult(studData: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    let dialogRef = this.matDialog.open(StudentresultComponent,{
      width: '80vw',
      height:'90vh',
      data: {
        studData: studData
      }
   

    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
      }
    });

  }

}
