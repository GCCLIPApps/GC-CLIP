import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
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
  dataSource: MatTableDataSource<Presentations>;


  @ViewChild(CreateDialogComponent) createdPresent: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  value: string = '';
  pageOption: number[] = [5, 10, 25, 100];
  Owner : string = (this._user.getFullname() == this._user.getFullname()) ? "Me"  : this._user.getFullname();




  // @ViewChild(MatTable) table: MatTable<Presentations>;


  
  constructor( 
    private _snackBar: MatSnackBar, 
    private _route: Router, 
    private _ds: DataService, 
    private _user: UserService, 
    private matDialog: MatDialog) {

      this.getAllPresentation()
     }


  ngOnInit(): void {
   
  }

  getAllPresentation(){
    this._ds.processData1('slides/byUserId', this._user.getUserID(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
  
      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      
      },err =>{
        console.log('err', err)
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
    const dialogConfig = this.matDialog.open(CreateDialogComponent, {
      autoFocus: true,
      disableClose: false
    });

    dialogConfig.afterClosed().subscribe((res: any) => {
        if (res) {
          console.log(res)
          this.dataSource.data.push(res)
          // this.table.renderRows();
          }
    });
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

 


openPresentation(id: string){

    this._route.navigate([]).then(result => {  window.open( `${this._user.webLink}editor?link=${btoa(this._user.webLink)}/${btoa(id)}`); });

  }

}
