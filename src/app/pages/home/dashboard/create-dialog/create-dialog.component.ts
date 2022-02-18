import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
  @Output() nameEmitter = new EventEmitter < string[] > ();  

  title: string = '';
  Error: boolean = false;
  constructor(private _ds: DataService,
    private _user: UserService,
    private dialogRef: MatDialogRef<CreateDialogComponent>,
    private _route: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.title){
    this._ds.processData1('slides/create/Presentation', 
    {instId: this._user.getUserID(), 
      sName_fld: this.title, 
      sTheme_fld: '',
      sColor_fld: ''}, 2)?.subscribe((res: any)=>{

        let load =  this._ds.decrypt(res.d)
        console.log(load);
        this._user.setPresentation(load.slideId, load.sCode , this.title, load.sPace);
        this._user.setPresentationTheme('', '');

        this._route.navigate(['/presentation'])
        this.onClose()

    }, err =>{
      console.log('err', err)
    });
    }
  }

  onClose(){
    this.dialogRef.close();
  }
}

