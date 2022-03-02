import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  forgotpasswordForm: FormGroup
  hide = true;
  Error: boolean = false;

  constructor(private _snackBar: MatSnackBar, private _fb: FormBuilder, private _http: DataService, private _router: Router) { }

  ngOnInit(): void {
    this.forgotpasswordForm = this._fb.group({
      accountno: ['', Validators.required],
      email: ['', Validators.required ],
      lname: ['', Validators.required]
    })
  }

  onSubmit(){
    console.log(this.forgotpasswordForm.value)
  }

}
