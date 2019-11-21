import 'hammerjs';//matereal for mobile touch vs.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';



import {MaterialModule} from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { MatchFormComponent } from './match-form/match-form.component';
import { FirestoreService } from './services/firestore.service';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { UserComponent } from './presence/user/user.component';
import { ChatComponent } from './chat/chat/chat.component';
import { TherapistComponent } from './therapist/therapist.component';
import { CardNumberDirective } from './directives/card-number.directive';
import { CardCvvDirective } from './directives/card-cvv.directive';
import { RoomService } from './services/room.service';
import { THomeComponent } from './t-dashboard/t-home/t-home.component';
import { TDashboardComponent } from './t-dashboard/t-dashboard/t-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    TestComponent,
    HomeComponent,
    LoginComponent,
    MatchFormComponent,
    DashboardUserComponent,
    UserComponent,
    ChatComponent,
    TherapistComponent,
    CardNumberDirective,
    CardCvvDirective,
    THomeComponent,
    TDashboardComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    
  ],
  providers: [AuthService, FirestoreService,RoomService],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent]
})
export class AppModule { }
