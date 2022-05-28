import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import Swal from 'sweetalert2'
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.scss']
})
export class ChangepassComponent implements OnInit {

  forgotpasswordForm: FormGroup
  hide = true;
  Error: boolean = false;

  constructor(private _snackBar: NotificationService, private _fb: FormBuilder, private _ds: DataService, private _router: Router,    
    private dialogRef: MatDialogRef<ChangepassComponent>,
    ) { }

  ngOnInit(): void {
    this.forgotpasswordForm = this._fb.group({
      accountno: ['', Validators.required],
      email: ['', Validators.required ],
      lname: ['', Validators.required],
      status: ['1'],
    })
  }

  onSubmit(){
    this._ds.processData1('users/account/checkCredentials', this.forgotpasswordForm.value, 1)?.subscribe((res: any)=>{
  let load = res;;


    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Email has been sent',
      text: 'Please check email for new password',
      showConfirmButton: true,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.dialogRef.close(load);
      }
    })
    }, err =>{
      
      this._snackBar.error("Wrong credentials");


    });
  }

}
