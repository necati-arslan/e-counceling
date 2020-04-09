import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RoomService } from 'src/app/services/room.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Output() closeSidenav = new EventEmitter<boolean>();//app te tanımlı bi event
  @Input('mobileQuery') mobileQuery: boolean;
  @Input('currentUrl') currentUrl: boolean;

  userAuth: any;
  userEmail: string;
  isExpanded: boolean = true;
  showSubmenu: boolean = false;
  rooms$: Observable<any>;
  source$: Observable<any>;
  countQuestion;
  countAppointment;
  lastSeans$;

  constructor(private authService: AuthService,
    private roomService: RoomService,
    private dialog: MatDialog,
    private router: Router) {

  }
  

  ngOnInit() {
    console.log(this.currentUrl)
    this.authService.userSubject$.subscribe((user: any) => {
      if (user.uid) {
        this.userAuth = user;
        

        ///////////get therapists of User //////

        this.roomService.getRooms(user.uid).subscribe(rooms=>{
          this.source$=of(rooms);
          this.rooms$= this.roomService.joinUser(this.source$);
        });


        ///last message/////
        let now=Date.now();
        if (user.type == 'therapist') {
          this.roomService.getLastQuestion(user.uid, user.type)
            .subscribe(questions => {
              this.countQuestion = questions.length
              console.log(this.countQuestion)
            })

        //reserved Appointment    
            this.roomService.getReservedAppointmentThepapist(user.uid)
            .subscribe(appointments=>{
              if(!appointments)  {this.countAppointment=0; return};
              appointments = appointments.filter((reserve:any) => reserve.timeStamp >= now);
              this.countAppointment=appointments.length;
              
            })
        }
        if (user.type == 'user') {
          this.roomService.getLastQuestionCountForUser(user.uid)
          .subscribe(
            questions=>{
              this.countQuestion=questions.length;
              console.log(this.countQuestion);
            }
          );
          //reserved appointment
          this.roomService.getReservedAppointmentUser(user.uid)
          .subscribe(appointments=>{  
            if(!appointments)  {this.countAppointment=0; return};
            appointments = appointments.filter((reserve:any) => reserve.timeStamp >= now);
            this.countAppointment=appointments.length;
          })
        } 
        ///last message/////  
        //last video chat////

        this.lastSeans$= this.roomService.getLastSeans(user.type,user.uid)

 
      } else {
        this.userAuth = null;
      }
    });



  }

  onClose() {

    console.log(this.isExpanded)
    console.log(this.mobileQuery)


    this.closeSidenav.emit(this.isExpanded);
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }

  startCounceling() {

      const dialogRef = this.dialog.open(LoginComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          console.log(result)
          let user = result.user
          this.authService.getUserById(user.uid)
          .subscribe((user:any)=>{
            console.log(user)
            if(user.type=="therapist") this.router.navigate(['t-dashboard']);
            if(user.type=="user") this.router.navigate(['dashboard']);
          }) 
        };
      })

  }

}
