import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-responseviewer',
  templateUrl: './responseviewer.component.html',
  styleUrls: ['./responseviewer.component.scss']
})
export class ResponseviewerComponent implements OnInit {

  responses: any;
  constructor(   @Inject(MAT_DIALOG_DATA) public data: any,
    private _ds: DataService, 
    public _user: UserService) { 
    if(this.data.msg){
      this.responses = this.data.msg;
      console.log(this.responses)
    }
  }

  ngOnInit(): void {
  
    
  }


  markAsAnswered(id: number ,status: number){
    if(status == 0){
      status = 1
    }else{
      status = 0
    }
   
    this._ds.processData1('response/markAnswered/'+id, status, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);

      for (var i = 0; i <= this.responses.length; i++){
        if (this.responses[i].id == id){
          this.responses[i].isanswered_fld = status;
            break;
        }
      }

        },err =>{
 
          console.log('err', err)
        });
  }


  public checkIfCardIsSelected(cardIndex: number): boolean {
    return cardIndex === 1;
  }

}
