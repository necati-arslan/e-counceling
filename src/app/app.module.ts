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
import { CardNumberDirective } from './directives/card-number.directive';
import { CardCvvDirective } from './directives/card-cvv.directive';
import { RoomService } from './services/room.service';
import { THomeComponent } from './t-dashboard/t-home/t-home.component';
import { TDashboardComponent } from './t-dashboard/t-dashboard/t-dashboard.component';
import { TherapistOfUserComponent } from './therapist-of-user/therapist-of-user.component';
import { TherapistCardComponent } from './therapist-card/therapist-card.component';
import { SeansPaymentComponent } from './seans-payment/seans-payment.component';
import { VideoAudioComponent } from './video-audio/video-audio.component';
import { UserOfTherapistComponent } from './user-of-therapist/user-of-therapist.component';
import { ReusabalDialogComponent } from './reusabal-dialog/reusabal-dialog.component';
import { SeansComponent } from './seans/seans.component';
import { SeansForTherapistComponent } from './seans-for-therapist/seans-for-therapist.component';
import { QuestionToTherapistComponent } from './question-to-therapist/question-to-therapist.component';
import { QuestionTemplateComponent } from './question-template/question-template.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UserForAdminPanelComponent } from './user-for-admin-panel/user-for-admin-panel.component';
import { ProfileTherapistComponent } from './profile-therapist/profile-therapist.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { EmailPipe } from './pipes/email.pipe';


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
    CardNumberDirective,
    CardCvvDirective,
    THomeComponent,
    TDashboardComponent,
    TherapistOfUserComponent,
    TherapistCardComponent,
    SeansPaymentComponent,
    VideoAudioComponent,
    UserOfTherapistComponent,
    ReusabalDialogComponent,
    SeansComponent,
    SeansForTherapistComponent,
    QuestionToTherapistComponent,
    QuestionTemplateComponent,
    AdminPanelComponent,
    UserForAdminPanelComponent,
    ProfileTherapistComponent,
    ProfileEditComponent,
    EmailPipe,
    
    
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
  entryComponents: [LoginComponent,
    SeansPaymentComponent,
    ReusabalDialogComponent,
    UserForAdminPanelComponent,
    ProfileTherapistComponent
  ]
})
export class AppModule { }
