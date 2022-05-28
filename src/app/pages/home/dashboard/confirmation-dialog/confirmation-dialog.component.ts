import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  isPresentation: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private _ds: DataService,
    private _user: UserService) {

    if(data){
    this.message = data.message || this.message;
    if (data.buttonText) {
      this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    }
    
    if(data.id){
        this.isPresentation = false
      }
    }

  }

  
  ngOnInit(): void {
  }

  deletePres(): void {
    this._ds.processData1('slides/delete/'+this.data.id,'', 2)?.subscribe((res: any) => {
      let load = res;;
        this.dialogRef.close(true);
        },err =>{
          // console.log('err', err)
        });
  }

  deleteSlide(): void {
    this._ds.processData1('/slides/pres/'+this.data.item.id+'/rem', '', 2)?.subscribe((res: any) => {
    let load = res;;
      this.dialogRef.close(true);
      },err =>{
        // console.log('err', this._ds.decrypt(err.d))
      });
  }
}

