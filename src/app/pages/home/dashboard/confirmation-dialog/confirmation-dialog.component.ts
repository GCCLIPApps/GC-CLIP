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
  presentationId: number;
  items : any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
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
        this.presentationId = data.id
    }else if(data.item.id){
      this.items = data.item
      }
    }
    console.log("no data")
  }

  
  ngOnInit(): void {
  }

  deletePres(): void {
    this._ds.processData1('slides/delete/'+this.presentationId,'', 2)?.subscribe((res: any) => {
        let load = this._ds.decrypt(res.d);
        this.dialogRef.close(true);
        },err =>{
          console.log('err', err)
        });
  }

  deleteSlide(): void {
    this._ds.processData1('/slides/pres/'+this._user.getSlideId()+'/rem', '', 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.dialogRef.close(true);
      },err =>{
        console.log('err', this._ds.decrypt(err.d))
      });
  }
}

