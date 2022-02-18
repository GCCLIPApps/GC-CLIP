import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "../app/login/login.component";
import { SignupComponent } from "../app/signup/signup.component";
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { MainComponent } from './pages/home/main/main.component';
import { EditorComponent } from './pages/presentation/editor/editor.component';
import { SlidemainComponent } from './pages/presentation/slidemain/slidemain.component';


// Auth Guard
import { AuthGuard } from './services/auth.service';

const routes: Routes = [
  // {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},

    { path: 'main', component: MainComponent,
      canActivate: [AuthGuard],
      children:[
        {path: 'app', component: DashboardComponent},
        {path: '', redirectTo: 'app', pathMatch: 'full'},
      ]},

    {path: 'presentation', component: SlidemainComponent,
        canActivate: [AuthGuard],
          children:[
            {path: 'editor', component: EditorComponent},
            {path: '', redirectTo: 'editor', pathMatch: 'full'},

      ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
