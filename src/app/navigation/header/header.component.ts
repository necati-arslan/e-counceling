import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { Observable } from 'rxjs';
import { UserInfo } from 'src/app/models/userInfo-model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();//app te tanımlı bi event
  
 

  toolbarColor: boolean = false; 
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  user$:Observable<UserInfo>

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.toolbarColor = window.pageYOffset >= 100;
  }

  currentUrl:Boolean=false;



  constructor(private authService: AuthService,
    private dialog: MatDialog,
    private router: Router) {

    router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if(e.url=='/') this.currentUrl=true;
        else this.currentUrl=false;
        console.log(this.currentUrl);
      }
    });


  }



  ngOnInit() {

    this.user$= this.authService.userSubject$
    this.isLoggedIn$= this.authService.isLoggedIn$;
    this.isLoggedOut$=this.authService.isLoggedOut$;

  }

  onToggleSidenav() {
    this.sidenavToggle.emit();

  }

  onLogout() {
    this.authService.logout();
  }

  startCounceling() {
 
    const dialogRef = this.dialog.open(LoginComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          console.log(result)
          let user = result.user
          this.authService.getUserById(user.uid).pipe(take(1))
          .subscribe((user:any)=>{
            console.log(user)
            if(user.type=="therapist") this.router.navigate(['t-dashboard']);
            if(user.type=="user") this.router.navigate(['dashboard']);
          }) 
        };
      })

  }



}
