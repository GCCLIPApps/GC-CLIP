import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';

@Component({
  selector: 'app-create-option',
  templateUrl: './create-option.component.html',
  styleUrls: ['./create-option.component.scss']
})
export class CreateOptionComponent implements OnInit {

  constructor(private matDialog: MatDialog,
    private _bottomSheetRef: MatBottomSheetRef) { }

  ngOnInit(): void {
  }
  openCreateDialog(createMsg: string){
    this._bottomSheetRef.dismiss();

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
