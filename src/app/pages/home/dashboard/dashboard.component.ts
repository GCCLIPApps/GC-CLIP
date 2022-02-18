import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
  

export interface Presentations {
  sName_fld: string;
  updatedOn: string;
  createdOn: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['sName_fld', 'Owner', 'updatedOn', 'createdOn', 'Action'];
  dataSource = new MatTableDataSource<Presentations>();
  
  value = '';
  pageSize = 7;
  pageOption = [5, 10, 25, 100];
  Owner : string = (this._user.getFullname() == this._user.getFullname()) ? "Me"  : this._user.getFullname();

  constructor( 
    private _snackBar: MatSnackBar, 
    private _route: Router, 
    private _ds: DataService, 
    private _user: UserService, 
    private matDialog: MatDialog) { }

  @ViewChild(CreateDialogComponent) createdPresent: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getAllPresentation()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getAllPresentation(){
    this._ds.processData1('slides/byUserId', this._user.getUserID(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
      },err =>{
        console.log('err', err)
      });
  }

  searchThis(){
    this.value = ""
  }
  applyFilter(){
    this.dataSource.filter = this.value.trim().toLocaleLowerCase();
  }

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    this.matDialog.open(CreateDialogComponent,{width: '30%'});
  }

  openDeleteDialog(presId: number, index: number) {
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
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
          this._snackBar.open("Presentation Deleted", '', {
            duration: 2000,
          });
      }
    });
}



  editPresentation(presId: number, name: string){

    this._ds.processData1('slides/'+presId,'', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
     
      console.log(load);
      this._user.setPresentation(load.id, load.sCode_fld,load.sName_fld,load.sPace_fld);
      this._user.setPresentationTheme(load.sTheme_fld, load.sColor_fld);
      this._route.navigate(['/presentation'])

      },err =>{
        console.log('err', err)
      });
  }

}
