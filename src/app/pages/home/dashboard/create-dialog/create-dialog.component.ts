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
      sTheme_fld: '#FFFFFF',
      sColor_fld: '#1D2127'}, 2)?.subscribe((res: any)=>{

      let load =  this._ds.decrypt(res.d)
 
      this._route.navigate([]).then(result => {  window.open( `${this._user.webLink}editor?link=${btoa(this._user.webLink)}/${btoa(load.id)}`); });
      this.dialogRef.close(load);

    }, err =>{
      console.log('err', err)
    });
    }
  }
}

