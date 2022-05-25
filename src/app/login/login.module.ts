import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/material.module';
import { ChangepassComponent } from './changepass/changepass.component';


@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      LoginRoutingModule,
      ReactiveFormsModule,
      MaterialModule
    ],
    declarations: [LoginComponent, ChangepassComponent]
  })
  export class LoginModule{}