import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

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

//Material
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table'  
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { MainNavComponent } from './pages/home/main-nav/main-nav.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRippleModule} from '@angular/material/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

// Cdk
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';

// Image Cropper
import { ImageCropperModule } from 'ngx-image-cropper';

// Socket
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ResponseviewerComponent } from './pages/presentation/editor/responseviewer/responseviewer.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
const config: SocketIoConfig = { url: 'http://localhost:3001', options: { autoConnect: false} };


const Material = [MatButtonToggleModule,MatBadgeModule,MatRippleModule,DragDropModule,ClipboardModule,MatSlideToggleModule,MatProgressSpinnerModule,MatProgressBarModule,MatExpansionModule,
  MatSnackBarModule, MatDialogModule,MatCardModule,MatFormFieldModule,MatInputModule,MatIconModule,MatButtonModule, MatSidenavModule,
  MatToolbarModule,MatDividerModule,MatListModule,MatMenuModule, MatTableModule, MatSortModule, MatPaginatorModule,MatTabsModule,LayoutModule,
  MatToolbarModule,MatButtonModule,MatSidenavModule,MatIconModule,MatListModule, MatTooltipModule,MatGridListModule, MatCheckboxModule];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
    MainNavComponent,
    ThemesComponent,
    RightclickComponent,
    ConfirmationDialogComponent,
    ImageCropperComponent,
    ResponseviewerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Material,
    SocketIoModule.forRoot(config),
    ContextMenuModule.forRoot(),
    ImageCropperModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    
  ],
  providers: [CookieService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
