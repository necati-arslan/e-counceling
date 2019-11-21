import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../auth/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  constructor(private dialog:MatDialog,
              private router: Router
              ) { }

  ngOnInit() {
    
  }

  startCounceling(){

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
