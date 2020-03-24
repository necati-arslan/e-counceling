import { Component, OnInit, HostListener, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  userAuth$: Observable<User>;//temizlencek
  currentUrl: Boolean = false;
  isExpanded: boolean = true;
  isOpen: boolean;//?
  mdq: boolean;//mediaquery
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;


  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;



  constructor(private authService: AuthService,
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

  }

  sidenavClose(isExpanded: boolean) {
    this.isExpanded = isExpanded;//from sidenav component to width for sidenav
    console.log(this.isExpanded);
    if (this.mobileQuery.matches) this.sidenav.close();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  closeSidenav(){
    
  }

}
