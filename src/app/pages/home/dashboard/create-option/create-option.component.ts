import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';

@Component({
  selector: 'app-create-option',
  templateUrl: './create-option.component.html',
  styleUrls: ['./create-option.component.scss']
})
export class CreateOptionComponent implements OnInit {

  constructor(private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  openCreateDialog(createMsg: string){

    const dialogConfig = this.matDialog.open(CreateDialogComponent, {
      data:{
        type: createMsg
      },
      autoFocus: true,
      disableClose: false
    });

    dialogConfig.afterClosed().subscribe((res: any) => {
        if (res) {
          // console.log(res)
          // this.dataSource.data.push(res)
          // this.table.renderRows();
          }
    });

  }

}
