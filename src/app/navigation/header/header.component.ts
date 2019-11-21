import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();//app te tanımlı bi event
  @Input('userAuth') userAuth$: Observable<any>;
 

  toolbarColor: boolean = false;
  userAuth: any;
  userEmail: string;

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
    this.userAuth$.subscribe((user: any) => {
      if (user) {
        this.userAuth = user;
        let email = user.email;
        this.userEmail = email.substring(0, email.lastIndexOf("@"));
        console.log(this.userEmail);
      } else {
        this.userAuth = null;
        console.log(this.userAuth);
      }
    })


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
          console.log(result);
          this.router.navigate(['/dashboard']);
        };
      })

  }



}
