import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "../app/login/login.component";
import { SignupComponent } from "../app/signup/signup.component";
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { MainComponent } from './pages/home/main/main.component';
import { EditorComponent } from './pages/presentation/editor/editor.component';
import { StudentpaceComponent } from './pages/presentation/editor/studentpace/studentpace.component';
import { SlidemainComponent } from './pages/presentation/slidemain/slidemain.component';


// Auth Guard
import { AuthGuard } from './services/auth.service';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},
    { path: 'main', component: MainComponent,
      canActivate: [AuthGuard],
      children:[
        {path: 'app', component: DashboardComponent},
        {path: '', redirectTo: 'app', pathMatch: 'full'},
      ]},

    {path: 'presentation/:code', component: SlidemainComponent,
    data:{
      title: 'asdsads'
    },
        canActivate: [AuthGuard],
          children:[
            {path: '', component: EditorComponent},
            {path: '', redirectTo: '', pathMatch: 'full'},

      ]},
    {path: 'quiz/:code/:link/start', component: StudentpaceComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
