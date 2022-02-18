import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup
  hide = true;

  constructor(private _snackBar: MatSnackBar, private _fb: FormBuilder, private _ds: DataService, private _router: Router) { }

  ngOnInit(): void {
    this.signupForm = this._fb.group({
      employeeno: ['', Validators.required ],
      email: ['', Validators.required],
      fname: ['', Validators.required ],
      mname: ['' ],
      lname: ['', Validators.required ],
      dept: ['', Validators.required ],
      password: ['', Validators.required],
      status: ['1']
    })
  }

  onSubmit(){
    console.log(this.signupForm.value);
    this._ds.processData1('users/Register', this.signupForm.value, 1)?.subscribe((res:any)=>{

      this._snackBar.open("You are now Registered", "", {
        duration: 1000,
      });

      this._router.navigate(['/login']);

    },err =>{
      console.log('err', err)
    });
    }


}
