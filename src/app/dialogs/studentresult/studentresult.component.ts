import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-studentresult',
  templateUrl: './studentresult.component.html',
  styleUrls: ['./studentresult.component.scss']
})
export class StudentresultComponent implements OnInit {
  fname: string ;
  lname: string;
  mname: string;
  email: string;
  score:number;
  totalquestion: number; 
  timeelapse:number;
  totalpoints: number;
  quizResults: any = []
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private _ds: DataService,
    private _user: UserService,  ) { 

    if(data){
      // console.log(data)
      this.fname = data.studData.fname_fld;
      this.lname =  data.studData.lname_fld;
      this.mname =  data.studData.mname_fld;
      this.email =  data.studData.emailadd_fld;
      this.score = data.studData.totalscore_fld
      this.totalquestion = data.studData.total_no_question_fld
      this.timeelapse = data.studData.totaltime_fld
      this.totalpoints = data.studData.totalpoints_fld
      this.getStudResult(data.studData.id_number)
    }
  }

  ngOnInit(): void {
  }

  getStudResult(id: number){
    this._ds.processData1(`scores/getScoreByStudId/${this._user.getPresentationId()}`, id, 2)?.subscribe((res: any)=>{
      let load = this._ds.decrypt(res.d)
      this.quizResults= load
      // console.log(this.quizResults)
    },err =>{

  
    });
  }
}
