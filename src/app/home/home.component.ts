import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../auth/login/login.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  user;
  constructor(private dialog:MatDialog,
              private router: Router,
              private authService:AuthService
              ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user=>{this.user=user;})
  }

  startCounceling(){
    
    if(this.user){
      this.router.navigate(['/dashboard']);
      return;
    }

    const dialogRef = this.dialog.open(LoginComponent) 
    .afterClosed()
    .subscribe(result=>{
      if (result) {
        console.log(result);
        this.router.navigate(['/dashboard']);
      };
    })
 
  }

}
