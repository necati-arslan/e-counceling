import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { MatchFormComponent } from './match-form/match-form.component';
import { AuthGuard } from './auth/login/auth.guard';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { UserComponent } from './presence/user/user.component';
import { ChatComponent } from './chat/chat/chat.component';
import { TherapistComponent } from './therapist/therapist.component';
import { TDashboardComponent } from './t-dashboard/t-dashboard/t-dashboard.component';
import { TGuard } from './auth/t-quard';
import { TherapistOfUserComponent } from './therapist-of-user/therapist-of-user.component';
import { VideoAudioComponent } from './video-audio/video-audio.component';
import { UserOfTherapistComponent } from './user-of-therapist/user-of-therapist.component';
import { SeansComponent } from './seans/seans.component';
import { SeansForTherapistComponent } from './seans-for-therapist/seans-for-therapist.component';
import { QuestionToTherapistComponent } from './question-to-therapist/question-to-therapist.component';
import { QuestionTemplateComponent } from './question-template/question-template.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

 
const routes: Routes = [
  { path: '', component:HomeComponent }, 
  { path: 'test', component:TestComponent },
  { path:'matching',component:MatchFormComponent},
  { path:'presence',component:UserComponent},
  { path:'dashboard',component:DashboardUserComponent,canActivate:[AuthGuard]},
  { path: 'chat/:roomId/:seansId', component: ChatComponent },
  { path: 'therapistOfUser/:uidTherapist/:roomId', component: TherapistOfUserComponent},
  { path: 'userOfTherapist', component: UserOfTherapistComponent},
  { path: 'questiontotherapist', component: QuestionToTherapistComponent},
  { path: 'questionTemplate', component: QuestionTemplateComponent},
  { path: 'seansForTherapist/:roomId/:displayName/:email', component: SeansForTherapistComponent},
  { path: 'therapist/:id', component: TherapistComponent },
  { path: 't-dashboard', component: TDashboardComponent,canActivate:[TGuard] },
  { path: 'video', component: VideoAudioComponent },
  { path: 'adminPanelToUser', component: AdminPanelComponent },

  


]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], 
  providers:[AuthGuard]
})
export class AppRoutingModule { }
