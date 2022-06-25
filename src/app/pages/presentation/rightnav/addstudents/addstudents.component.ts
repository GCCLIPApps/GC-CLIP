import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatOption } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Students {
  name: string;
  emailadd: string;
}


@Component({
  selector: 'app-addstudents',
  templateUrl: './addstudents.component.html',
  styleUrls: ['./addstudents.component.scss']
})
export class AddstudentsComponent implements OnInit {
    step1Complete =  false;
    step2Complete = false;
    firstFormGroup!: FormGroup;
    secondFormGroup!: FormGroup;

    classid: number;
    studentsid: any = 0
    students: any = []
    classes: any = []
    studentlists: any = []

    selected: any;
    inputValue: string= '';
    ImageLink = this._us.imageLink;
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);

    isAdd: number

    displayedColumns: string[] = ['#','class','program','name', 'emailadd', 'action'];
    dataSource = new MatTableDataSource<Students>();


  constructor(  
    @Inject (MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddstudentsComponent>,
    private _formBuilder: FormBuilder,
    private _ds: DataService, 
    private _us: UserService,    
    private __sb: NotificationService,

    ) {
      if(data){
       this.isAdd = data.status
      }

     }

     @ViewChild('allSelected') allSelected!: MatOption;
     @ViewChild(MatSort) sort!: MatSort;
     @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    if(this.isAdd){
      this.showClasses()
      this.classesFormgroup()

    }else{
      this.getStudentslist()
     
    }
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  classesFormgroup(){
    this.firstFormGroup = this._formBuilder.group({
      class_id: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      student_id: ['', Validators.required],

    });
  }

    // Select Students Array
    change(studentid: any) {
      this.studentsid = studentid
     }
  
  
   //Mat option Toggle all 
    toggleAllSelection() {
      this.studentsid = []
  
      if (this.allSelected.selected) {
        this.secondFormGroup.controls.student_id.patchValue([...this.students.map((item: any) => item.accountno_fld),0])
        this.studentsid = this.secondFormGroup.get(`student_id`)?.value
      } else {
   
        this.secondFormGroup.controls.student_id.patchValue([]);
      }
  
    }

  showClasses() {

    this._ds.processData1('assignquiz/showClasses/instructor', this._us.getUserID(), 2)?.subscribe((res: any)=>{
      let load = this._ds.decrypt(res.d)
      this.classes = load
    }, err =>{
    
        console.log('Error',err)
     
    });
  
  }

  selectClass(classid:any){
    this.classid = classid;
    this._ds.processData1('assignquiz/getStudentsinClass/instructor', {class_id: classid, pres_id: this._us.getPresentationId()}, 2)?.subscribe((res: any)=>{
      let load = this._ds.decrypt(res.d)
      this.students = load

    }, err =>{
    
        console.log('Error',err)
     
    });
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

  // Get Students Assigned 
  getStudentslist(){
    this._ds.processData1('assignquiz/getallassigned/students', this._us.getPresentationId(), 2)?.subscribe((res: any)=>{
      let load = this._ds.decrypt(res.d)
      console.log(load)
      this.dataSource = new MatTableDataSource(load); 

    }, err =>{
    
        console.log('Error',err)
     
    });
  }

  removeStudent(id: number, accountno: number, index: number){
  
    this._ds.processData1(`assignquiz/delete/students/${accountno}`,id, 2)?.subscribe((res: any)=>{
      this.getStudentslist()
      this.dataSource.data.splice(index, 1);
      this.__sb.success("Student has been removed");
    }, err =>{
    
        console.log('Error',err)
     
    });

  }

  addStudents(){
    if(this.firstFormGroup.valid  && this.secondFormGroup.valid){
      
      let studentsData = this.countStudents();
      
      this._ds.processData1('assignquiz/add/students',studentsData, 2)?.subscribe((res: any)=>{

        this.dialogRef.close(true);

        this.__sb.success("New student has been added");
  
      }, err =>{
      
          console.log('Error',err)
       
      });
    }
  
  }

  countStudents(){
    var data=[];

    if(this.studentsid.length){
      for(let i = 0; this.studentsid.length > i; i++){
  

        if(i <= this.studentsid.length){
          data.push({
            quizid_fld: this._us.getPresentationId(),
            classid_fld: this.firstFormGroup.get('class_id')?.value,
            accountno_fld:this.studentsid[i]
          });
        
        }
      }
    }
    return JSON.stringify(data)
  }

  clearInput(e:any){
    console.log(e)
    this.inputValue = ""
  }

  showDropdown(e:any){
    console.log(e)
    // this.studentlists
  }



}
