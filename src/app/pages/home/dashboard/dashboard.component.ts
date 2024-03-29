import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { Animations } from 'src/app/animation';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DatePipe } from '@angular/common';
import pptxgen from "pptxgenjs";

import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { CreateOptionComponent } from './create-option/create-option.component';
import { NotificationService } from 'src/app/services/notification.service';
  

export interface Presentations {
  sName_fld: string;
  updatedOn: string;
  createdOn: string;
}

var animates = new Animations()

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [animates.listAnimation]
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['sName_fld', 'Owner', 'updatedOn', 'createdOn', 'Action'];
  dataSource: MatTableDataSource<Presentations>;

  
  @ViewChild(CreateDialogComponent) createdPresent: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  value: string = '';
  pageOption: number[] = [5, 10, 25, 100];
  currentTabIndex = 0
  Owner : string = (this._user.getFullname() == this._user.getFullname()) ? "Me"  : this._user.getFullname();

  listofQuiz: number
  listOfPres: number;
  forAnimation: any;
  interval: any;
  // @ViewChild(MatTable) table: MatTable<Presentations>;


  
  constructor( 
    private _bottomSheet: MatBottomSheet,
    private _sb: NotificationService, 
    private _route: Router, 
    private _ds: DataService, 
    private _user: UserService, 
    private matDialog: MatDialog) {

     }


  ngOnInit(): void {
    this.getAllQuiz()
    this.getAllPresentation();
  }

  onTabChange(e: any) {
    if(e.index == 0){
      this.interval = setTimeout(() => {
        this.getAllPresentation();
      }, 200)
    }
    if(e.index == 1){
      this.interval = setTimeout(() => {
        this.getAllQuiz()
      }, 200)
    }
  } 

  Presentations: any = []

  getAllPresentation(){
    this._ds.processData1(`slides/byUserId/${0}`, this._user.getUserID(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.forAnimation = load
      this.Presentations = load
      // this.dataSource = new MatTableDataSource(load); 
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      },err =>{
        // console.log('err', err)
      });
  }

  Quizzes: any = []
  
  getAllQuiz(){
    this._ds.processData1(`slides/byUserId/${1}`, this._user.getUserID(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.forAnimation = load
      this.Quizzes = load
      // this.dataSource = new MatTableDataSource(load); 
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      // this.listofQuiz = load.length
      },err =>{
        // console.log('err', err)
      });
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

  onCreate(){
    const dialogRef =  this.matDialog.open(CreateOptionComponent,{
      width: '40%'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDeleteDialog(presId: number, index: number, status: number) {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent,{
      data:{
        id: presId,
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._sb.success("Presentation Removed");

          if(status){
            this.Quizzes.splice(index, 1);
          }else{
            this.Presentations.splice(index, 1);
          }
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();


      }
    });
}


  openPresentation(id: string){

    this._route.navigate([]).then(result => {  window.open( `${this._user.webLink}editor?link=${btoa(this._user.webLink)}/${btoa(id)}`); });

  }

  exportResult(id: number){
    // console.log(id)
    this._ds.processData1(`scores/getAllScores/${id}`, '', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);

        this.generateExcel(load);

      },err =>{
        // console.log('err', err)
      });
  }

  datePipe: DatePipe = new DatePipe('en-PH');

  generateExcel(load: any){
    var data = [];
    // var date = new Date()

    for (var i = 0; i < load.length; i++){
      var filteredData =  {
        FullName: load[i].lname_fld +' '+load[i].fname_fld +' '+ load[i].mname_fld,
        TotalScore: load[i].totalscore_fld,
        TotalPoints: load[i].totalpoints_fld,
        Quiz_Created_On:  this.datePipe.transform(load[0].createdOn, 'yyyy-MMM-dd')
      }
      data.push(filteredData)
    }
    
        var options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          showTitle: true,
          title: load[0].sName_fld,
          useBom: true,
          noDownload: false,
          headers: ["FullName", "TotalScore", "TotalPoints","Quiz Created On"]
        };
        
      new ngxCsv(data, load[0].sName_fld,options);
  }

  gotoResult(id: number){
    this._route.navigate([`/quiz/${btoa(String(id))}/${btoa('finalResult')}/result`])
  }

  generatePptx(pres: any){
    // console.log(pres)
    let pptx = new pptxgen();

    // // 2. Add a Slide
    let slide = pptx.addSlide();

    // // 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
    let textboxText = pres.sName_fld;
    let textboxOpts = { x: 1, y: 1,  color: pres.sColor_fld.replace(/\#\w\w+\s?/g, ''),
    background: pres.sTheme_fld.replace(/\#\w\w+\s?/g, ''),fontSize: 18  };
    slide.addText(textboxText, textboxOpts);

    // // 4. Save the Presentation
    pptx.writeFile({ fileName: textboxText });
  }

}
