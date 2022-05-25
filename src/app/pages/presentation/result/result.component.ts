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

import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  
  id: any;
  viewresult: string;
  viewers: any = [];
  interval: any;
  studentslists: any = 0;
  totalQuizPages: any = 0 
  dataSource = new MatTableDataSource<Viewers>();
  studentFinalResults: any = []
  displayedColumns1: string[] = ['no_fld','name_fld', 'email_fld', 'right_fld', 'wrong_fld','points_fld','created_fld'];

  displayedColumns: string[] = ['no_fld', 'question_fld', 'right_fld', 'wrong_fld', 'percentage_fld'];
  ImageLink = this._user.imageLink;
  currentTabIndex = 0
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(  private location: Location,
    private activatedRoute: ActivatedRoute,
    private _route: Router,
    private breakpointObserver: BreakpointObserver,  private _ds: DataService, 
    public _user: UserService) { }

  ngOnInit(): void {


    this.activatedRoute.params.subscribe((params) => {
      this.id = { ...params['keys'], ...params };
      this.viewresult = atob(this.id.link)
      let code = Number(atob(this.id.code))
        if(this.viewresult === 'finalResult'){
          console.log('asdasds',code)
          this.getPresentation(code)
            this.getFinalResult(code)
        }
      });
  }
  sColor: string;
  sTheme: string;
  title: string;
  date: any;
  value: string;

  returnpage(){
    this.location.back()
  }
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
  onTabChange(event: any) {
    if(event.index == 0){
      this.getFinalResult(Number(atob(this.id.code)))
    }else{
      // this.getallata()3
      // this.checkViewers()
      this.getquizscoretally()
    }
  }

  viewEditor(){
    this._route.navigate([]).then(result => {  window.open( `${this._user.webLink}editor?link=${btoa(this._user.webLink)}/${btoa(String(this._user.getPresentationId()))}`); });

  }

  getPresentation(id: number){
    this._ds.processData1(`slides/${id}`,'', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      console.log(load)
      this._user.setPresentation(load.id, load.sCode_fld,load.sName_fld,load.sPace_fld, load.isQuiz_fld, load.isStarted_fld, load.isassigned_fld);
      this._user.setPresentationTheme(load.sTheme_fld, load.sColor_fld);
      this.title = this._user.getPresentationName()
      this.sTheme = this._user.getPresentationTheme();
      this.sColor = this._user.getPresentationFontColor();
      this.date = load.createdOn
      this.checkViewers()
      this.getquizpagecount()
      

    },err =>{
      // console.log('err', err)
    });
  }

  getFinalResult(id: number){
    this._ds.processData1(`scores/getAllScores/${id}`, '', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      console.log(load)

      // this.studentFinalResults = load
      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
      },err =>{
        // console.log('err', err)
      });
  }


  checkViewers(){
    this._ds.processData1('history/getSlideViewer', this._user.getPresentationId(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log('viewer',load);
      this.studentslists = load

      },err =>{
        // console.log('err', err)
      });
  }

  getallData(){
    this._ds.processData1('scores/allstudData/student', {sId: Number(atob(this.id.code)), accountno: this._user.getUserID()}, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);

      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
        console.log(load)
          },err =>{
        // console.log('err', err)
      });``
  }

  
  getquizscoretally(){
    this._ds.processData1('scores/scoretally/instructor', atob(this.id.code), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);

      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
        console.log(load)
          },err =>{
        // console.log('err', err)
      });
  }

  getquizpagecount(){
    this._ds.processData1('slides/pres/getquizcount/quiz',{ sId: this._user.getPresentationId(), quiz: 'quiz',identify: 'identification'}, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.totalQuizPages = load
        console.log(load)
          },err =>{
        // console.log('err', err)
      });``
  }

  
  startRequest(){
    this.interval = setInterval(() =>{ 
      this.getFinalResult(Number(atob(this.id.code)))
      this.getquizscoretally()
    }, 2000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}
