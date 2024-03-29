import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { MatchFormComponent } from './match-form/match-form.component';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { UserComponent } from './presence/user/user.component';
import { ChatComponent } from './chat/chat/chat.component';
import { TDashboardComponent } from './t-dashboard/t-dashboard/t-dashboard.component';
import { TGuard } from './guards/t-quard';
import { AuthGuard } from './guards/auth-guard.guard';
import { SeansGuard } from './guards/seans-guard';
import { AdminGuard } from './guards/admin-guard';
import { TherapistOfUserComponent } from './therapist-of-user/therapist-of-user.component';
import { VideoAudioComponent } from './video-audio/video-audio.component';
import { UserOfTherapistComponent } from './user-of-therapist/user-of-therapist.component';
import { SeansComponent } from './seans/seans.component';
import { SeansForTherapistComponent } from './seans-for-therapist/seans-for-therapist.component';
import { QuestionToTherapistComponent } from './question-to-therapist/question-to-therapist.component';
import { QuestionTemplateComponent } from './question-template/question-template.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { UserForAdminPanelComponent } from './user-for-admin-panel/user-for-admin-panel.component';
import { AppointmentTableComponent } from './appointment-table/appointment-table.component';
import { PageNotFoundComponent } from './page-not-found-component/page-not-found-component.component';
import { StripeCheckoutComponent } from './stripe-checkout/stripe-checkout.component';
import { StripeSimpleTestComponent } from './stripe-simple-test/stripe-simple-test.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'matching', component: MatchFormComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardUserComponent, canActivate: [AuthGuard] },
  { path: 'chat/:roomId/:seansId', component: ChatComponent, canActivate: [SeansGuard] },
  { path: 'therapistOfUser/:uidTherapist/:roomId', component: TherapistOfUserComponent, canActivate: [AuthGuard] },
  { path: 'userOfTherapist', component: UserOfTherapistComponent, canActivate: [TGuard] },
  { path: 'questiontotherapist', component: QuestionToTherapistComponent, canActivate: [AuthGuard] },
  { path: 'questionTemplate', component: QuestionTemplateComponent, canActivate: [AuthGuard] },
  { path: 'seansForTherapist/:roomId/:displayName/:email', component: SeansForTherapistComponent, canActivate: [TGuard] },
  { path: 't-dashboard', component: TDashboardComponent, canActivate: [TGuard] },
  //{ path: 'video', component: VideoAudioComponent,canActivate:[AuthGuard] }, 
  { path: 'adminPanelToUser', component: AdminPanelComponent,canActivate:[AdminGuard] },//admin
  { path: 'profile-edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'appointmentTable', component: AppointmentTableComponent, canActivate: [AuthGuard] },
  { path: 'stripe-checkout', component: StripeCheckoutComponent, canActivate: [AuthGuard] },
  { path: 'stripetest', component: StripeSimpleTestComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  {path: '**',component: PageNotFoundComponent},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
