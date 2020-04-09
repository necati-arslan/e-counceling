import { Component, OnInit, HostListener, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { RoomService } from './services/room.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'e-counceling';

  currentUrl: Boolean = false;
  isExpanded: boolean = true;
  mdq: boolean;//mediaquery
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  user;
  userId;


  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;



  constructor(private authService: AuthService,
    private roomService: RoomService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
      this.mdq = this.mobileQuery.matches;
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.mdq = this.mobileQuery.matches;


    router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (e.url == '/') { this.currentUrl = true; }
        else {
          this.currentUrl = false;
        }
      }
    });
  }



  ngOnInit() {

    //this.authService.userSubject$.subscribe(user=>console.log(user))
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.authService.isLoggedOut$;
    this.authService.userSubject$.subscribe(user => {
      this.user = user
      this.userId = this.user.uid

      this.checkLastSeansDuration(this.user.type, this.userId);
      
      if (user.type == 'therapist') this.checkReservedAppointment(this.userId);

    });

  }

  sidenavClose(isExpanded: boolean) {
    this.isExpanded = isExpanded;//from sidenav component to width for sidenav
    console.log(this.isExpanded);
    if (this.mobileQuery.matches) this.sidenav.close();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  closeSidenav() {

  }

  checkLastSeansDuration(userType,userId) {
    this.roomService.getLastSeans(userType, userId).subscribe((lastSeans: any) => {
      if (!lastSeans) return;
      if (lastSeans.state == "finished") return;//sorun olursa finishedtime kullan

      let createdTime = lastSeans.createdtime;
      console.log(createdTime);
      let now = Date.now();
      let eventTime = now + (1000 * 30);//(1000*60*60)
      let diff = eventTime - now;
     
      setTimeout(() => {
        console.log('initilazing checkLastSeans for termination');
        let data = {
          finishedTime: Date.now(),
          state: 'finished'
        }
        console.log(lastSeans);
        this.roomService.getRoomById(lastSeans.roomId).subscribe((room: any) => {
          this.roomService.getLastSeans(this.user.type, this.userId).pipe(take(1)).subscribe((controlLastSeans:any)=>{
            if (room.uidtherapist == this.userId) {
              this.roomService.finishSeans(lastSeans);
              this.roomService.updateAvaible(this.userId,true);
            }
            if(lastSeans.seansId!=controlLastSeans.seansId) return;//chek itself seans
            if (room.uiduser == this.userId) this.roomService.updateLastSeansUserById(this.userId, data);
            if (room.uidtherapist == this.userId) this.roomService.updateLastSeansTherapistsById(this.userId, data);
          });
        })
      }, diff)

    });

  }

  checkReservedAppointment(userId) {
    this.roomService.getReservedAppointmentThepapist(this.userId)
      .subscribe((reservations: any) => {
        //console.log(reservations)
        if (!reservations) return;
        let now = Date.now();

        let reservationNext = this.getMin(reservations, now)

        console.log('reservationNext',reservationNext);
        if (!reservationNext) return;
        let eventTime = reservationNext.timeStamp//15 dk eklenebilir 
        //console.log(eventTime);
        let addnow = Date.now() + (1000 * 20)

        if (eventTime < now) return;

        this.roomService.getSeansById(reservationNext.roomId, reservationNext.seansId).subscribe(
          (seans: any) => {
            console.log(seans) 
            if (seans.state == 'continuing') this.countDownAppointment(addnow, reservationNext);
          }
        )

      })

  }

  getMin(reservations, now) {
    reservations = reservations.filter(reserve => reserve.timeStamp >= now);
    let reservationNext = reservations.reduce((min, b) => {
      if (min.timeStamp < b.timeStamp) { return min; } else { return b }
    }, reservations[0]);
    return reservationNext;
  }

  countDownAppointment(eventTime, reservationNext) {

    let firedAvaible: number = (15 * 1000)//( 65*60*1000)//65 dk
    let isFiredAvaible = false

    let firedSeansLive: number = (5 * 1000)//1dk
    let isfiredSeansLive = false;
    console.log(">>>>>>>>>>>>>>>>>")
    let appointment = setInterval(() => {

      let now = Date.now();
      let diff = eventTime - now
      console.log(diff)

      if (diff <= firedAvaible && !isFiredAvaible) {
        isFiredAvaible = true
        this.roomService.updateAvaible(this.userId, false);
        console.log('firedAvaible')
      }

      if (diff <= firedSeansLive && !isfiredSeansLive) {
        isfiredSeansLive = true;
        console.log('firedSeansLive');

        this.roomService.getLastSeans(this.user.type, this.userId)
          .pipe(take(1)).subscribe((lastSeans: any) => {
            if(lastSeans) {
              if (reservationNext.seansId == lastSeans.seansId) return;
            }
            //this.roomService.finishSeans(lastSeans);
            this.roomService.creatReservedLastSeans(reservationNext, this.user);
          });


        clearInterval(appointment);
      }
    }, 1000)

  }

}
