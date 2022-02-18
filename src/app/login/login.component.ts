import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';
import { DataSchema } from '../data-schema';
import { DataService } from "../services/data.service";
import { UserService } from '../services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private keyString = new DataSchema();

  public version = this._user.appVersion;
  Error: boolean = false;
  rememberme: any;
  loginForm: FormGroup
  hide = true;
  counter(i: number) {
    return new Array(i);
  }
  constructor(
    private _cs: CookieService,
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder, 
    private _ds: DataService,
    private _user: UserService,  
    private _router: Router) { 
    
  }  


  ngOnInit(): void {
    this.rememberme = atob((localStorage.getItem(btoa('rememberme')?.replace('=','')) || '' ))

    this.loginForm = this._fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      status: ['1'],
      rememberme: [this.rememberme]
    })

    if(this.rememberme){

      let email = atob(localStorage.getItem(btoa('email').replace('=',''))||'')
      let decrypted =  CryptoJS.AES.decrypt( localStorage.getItem(btoa('password').replace('=',''))||'', this.keyString.defaultmessage)
      let password = decrypted.toString(CryptoJS.enc.Utf8)

      this.loginForm.setValue({
        email: email,
        password: password,
        status: '1',
        rememberme: this.rememberme
      })
    }

    if(this._user.isUserLoggedIn()){

       this._router.navigate(['/main']);
    }
   
  }


  signIn(){
    localStorage.removeItem(btoa('email'));
    localStorage.removeItem(btoa('password'));
    localStorage.removeItem(btoa('rememberme'));

    this._ds.processData1('users', this.loginForm.value, 1)?.subscribe((res: any)=>{
      let load = this._ds.decrypt(res.d)
      
      this._cs.set(btoa('gcclipfaculty'), CryptoJS.AES.encrypt(JSON.stringify(load.uData), this.keyString.defaultmessage).toString());

      load = load.uData
      this._user.setUserLoggedIn(load.id, load.token, load.email, load.fname, load.mname, load.lname, load.status, load.dept, load.program, load.passwordchange, load.profile);
      
      if(this.loginForm.get('rememberme')?.value){
        let password = CryptoJS.AES.encrypt(this.loginForm.get('password')?.value, this.keyString.defaultmessage).toString()
        localStorage.setItem(btoa('email').replace('=', ''), btoa(this.loginForm.get('email')?.value).replace('=', ''))
        localStorage.setItem(btoa('password').replace('=', ''), password);
        localStorage.setItem(btoa('rememberme').replace('=', ''), btoa(this.loginForm.get('rememberme')?.value))
      }

      this._router.navigate(['/main']);
      this._snackBar.open("Welcome "+ this._user.getFullname(), "", {
        duration: 500,
      });

      }, err =>{
        this.Error = true;
        setTimeout(() => { this.Error = false}, 5000)

       
      });
  }

}
