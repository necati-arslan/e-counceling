import { Component, OnInit, HostListener, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';
import { PresenceService } from './presence/services/presence.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomService } from './services/room.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router,NavigationEnd } from '@angular/router';
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
  userAuth$: Observable<User>;
  lastSeans$: Observable<any>;
  userAuth: any;
  currentUrl:Boolean=false;
  isExpanded:boolean=true;
  opened:boolean;

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  
  

  constructor(private authService: AuthService,
    private presence: PresenceService,
    private afAuth:AngularFireAuth,
    private afsService: AngularFirestore,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    console.log(this.mobileQuery.matches); 
    

    router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if(e.url=='/') this.currentUrl=true;
        else this.currentUrl=false;
        console.log(this.currentUrl);
      }
    });
   }

  

  ngOnInit() {

   this.userAuth$= this.authService.user$.pipe(map(user => { 
     if (user) {
        if (user.type == "therapist") this.router.navigate(['t-dashboard']);
        if (user.type == "user" && user.matching == false) this.router.navigate(['dashboard']);
        return this.userAuth = user;
     }else{return this.userAuth=null}
   }));

  
  }

  sidenavClose(isExpanded:boolean){
     this.isExpanded= isExpanded;
    if(this.mobileQuery.matches) this.sidenav.close();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
 
}
