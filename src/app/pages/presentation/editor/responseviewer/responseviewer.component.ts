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
  currentTabIndex = 0
  responses: any [] =[];
  questions: any;
  answeres:any;
  sColor: string =   this._user.getPresentationFontColor()
  sTheme: string =  this._user.getPresentationTheme()
  interval:any;
  constructor(   @Inject(MAT_DIALOG_DATA) public data: any,
    private _ds: DataService, 
    public _user: UserService) { 
  }
  
  ngOnInit(): void {
    this.getQuestions();
    this.getAnsweres()
  }
  onTabChange(e: any) {
    if(e.index == 0){
      this.interval = setTimeout(() => {
        this.getQuestions();
      }, 200)
    }
    if(e.index == 1){
      this.interval = setTimeout(() => {
        this.getAnsweres()
      }, 200)
    }
  }

  getQuestions(){
    this._ds.processData1(`response/getQuestions/${0}`,this._user.getSlideId(), 2)?.subscribe((res: any) => {
      this.questions = this._ds.decrypt(res.d);


   
     
      this.getResponse()
      },err =>{
        // console.log('err', err)
      });
  }

  getAnsweres(){
    this._ds.processData1(`response/getQuestions/${1}`,this._user.getSlideId(), 2)?.subscribe((res: any) => {
      this.answeres = this._ds.decrypt(res.d);

    
     
  
      this.getResponse()
      },err =>{
        // console.log('err', err)
      });
  }




  markAsAnswered(id: number ,status: number, index: number){
    if(status == 0){
      this.questions.splice(index, 1);
      status = 1
    }else{
      this.answeres.splice(index, 1);
      status = 0
    }
   
    this._ds.processData1('response/markAnswered/'+id, status, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.getResponse()

        },err =>{
 
          // console.log('err', err)
        });
  }


  public checkIfCardIsSelected(cardIndex: number): boolean {
    return cardIndex === 1;
  }


  getResponse(){
      this._ds.processData1('response/getAllResponseBysdId', this._user.getSlideId() , 2)?.subscribe((res: any) => {
        let load = this._ds.decrypt(res.d);
        this.responses = load;

          },err =>{
            // console.log('err', err)
          });

  }

}
