import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-addstudents',
  templateUrl: './addstudents.component.html',
  styleUrls: ['./addstudents.component.scss']
})
export class AddstudentsComponent implements OnInit {
    studentlists: any = []
    fetchedstuds: any = []
    selected: any;
    inputValue: string= '';
    ImageLink = this._us.imageLink;
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);


  constructor(private _ds: DataService, private _us: UserService,    private _snackBar: MatSnackBar,

    ) { }

  ngOnInit(): void {
  this.showStudentInstantly()
  this.getStudentslist()
  }


  showStudentInstantly(){

    this._ds.processData1('assignquiz/search/students', this.emailFormControl.value, 2)?.subscribe((res: any)=>{
      let load = this._ds.decrypt(res.d)

      this.studentlists = load
      console.log(load)
    }, err =>{
    
        console.log('Error',err)
     
    });
  }

  getStudentslist(){
    this._ds.processData1('assignquiz/getallassigned/students', this._us.getPresentationId(), 2)?.subscribe((res: any)=>{
      let load = this._ds.decrypt(res.d)

      this.fetchedstuds = load
      console.log(load)
    }, err =>{
    
        console.log('Error',err)
     
    });
  }

  addStudents(){
    if(this.selected){
      this._ds.processData1('assignquiz/add/students',{ 
        quizid_fld:  this._us.getPresentationId(),
        accountno_fld: this.selected,
      }, 2)?.subscribe((res: any)=>{
        this.selected = ''
        this.getStudentslist()

        this._snackBar.open('',"New student has been added", {
          duration: 2000,
          panelClass: ['login-snackbar']
        });
  
      }, err =>{
      
          console.log('Error',err)
       
      });
    }
  
  }
  // 0414A

  clearInput(e:any){
    console.log(e)
    this.inputValue = ""
  }

  showDropdown(e:any){
    console.log(e)
    // this.studentlists
  }

  removeStudent(id: number, accountno: number, index: number){
    this._ds.processData1(`assignquiz/delete/students/${accountno}`,id, 2)?.subscribe((res: any)=>{
      this.fetchedstuds.splice(index, 1);

      this._snackBar.open('',"Student has been removed", {
        duration: 2000,
        panelClass: ['login-snackbar']
      });

    }, err =>{
    
        console.log('Error',err)
     
    });

  }

}
