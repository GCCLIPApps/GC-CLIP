import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './pages/home/main/main.component';
import { SidenavComponent } from './pages/home/sidenav/sidenav.component';
import { HeaderComponent } from './pages/home/header/header.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { CreateDialogComponent } from './pages/home/dashboard/create-dialog/create-dialog.component';
import { SlidelistComponent } from './pages/presentation/slidelist/slidelist.component';
import { EditorComponent } from './pages/presentation/editor/editor.component';
import { SlideheaderComponent } from './pages/presentation/slideheader/slideheader.component';
import { SlidemainComponent } from './pages/presentation/slidemain/slidemain.component';
import { RightnavComponent } from './pages/presentation/rightnav/rightnav.component';
import { RightclickComponent } from './pages/presentation/slidelist/rightclick/rightclick.component';
import { ThemesComponent } from './pages/presentation/slidemain/themes/themes.component';
import { ConfirmationDialogComponent } from './pages/home/dashboard/confirmation-dialog/confirmation-dialog.component';
import { ImageCropperComponent } from './pages/presentation/rightnav/image-cropper/image-cropper.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

//Material
import { MaterialModule } from 'src/material.module';

// Image Cropper
import { ImageCropperModule } from 'ngx-image-cropper';

// Socket
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ResponseviewerComponent } from './pages/presentation/editor/responseviewer/responseviewer.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CreateOptionComponent } from './pages/home/dashboard/create-option/create-option.component';
import { FullscreenviewComponent } from './pages/presentation/editor/fullscreenview/fullscreenview.component';
import { StudentpaceComponent } from './pages/presentation/editor/studentpace/studentpace.component';
import { InstructorpaceComponent } from './pages/presentation/editor/instructorpace/instructorpace.component';
import { AddstudentsComponent } from './pages/presentation/rightnav/addstudents/addstudents.component';
import { ResultComponent } from './pages/presentation/result/result.component';
import { ProfileComponent } from './pages/profile/profile.component';
// const config: SocketIoConfig = { url: 'http://gordoncollegeccs.edu.ph:4231', options: { autoConnect: false} };
const config: SocketIoConfig = { url: environment.socket, options: { autoConnect: false} };


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SidenavComponent,
    HeaderComponent,
    DashboardComponent,
    SignupComponent,
    CreateDialogComponent,
    SlidelistComponent,
    EditorComponent,
    SlideheaderComponent,
    SlidemainComponent,
    RightnavComponent,
    ForgotpasswordComponent,
    ThemesComponent,
    RightclickComponent,
    ConfirmationDialogComponent,
    ImageCropperComponent,
    ResponseviewerComponent,
    CreateOptionComponent,
    FullscreenviewComponent,
    StudentpaceComponent,
    InstructorpaceComponent,
    AddstudentsComponent,
    ResultComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    ContextMenuModule.forRoot(),
    ImageCropperModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    Ng2SearchPipeModule
  ],
  providers: [CookieService, Title,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FullscreenviewComponent,
    StudentpaceComponent,
    InstructorpaceComponent,
  ]
})
export class AppModule { }
