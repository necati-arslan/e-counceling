import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
 
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Output() closeSidenav = new EventEmitter<boolean>();//app te tanımlı bi event
  @Input('userAuth') userAuth$:Observable<any>;
  @Input('mobileQuery') mobileQuery:boolean;
  userAuth:any;
  userEmail:string;
  isExpanded:boolean=true;

  
  constructor(private authService:AuthService,
    private dialog:MatDialog,
    private router: Router) { 
    
  }


  ngOnInit() {
    this.userAuth$.subscribe((user:any)=>{
      if(user){
      this.userAuth=user;
      let email = user.email;
      this.userEmail = email.substring(0, email.lastIndexOf("@"));
       }else{
        this.userAuth=null;
      }
    });
  }

  onClose(){
    this.closeSidenav.emit(this.isExpanded);
  }

  onLogout(){
    this.authService.logout();
    this.onClose();
  }

  startCounceling(){

    const dialogRef = this.dialog.open(LoginComponent)
    .afterClosed()
    .subscribe(result=>{
      if (result) {
        console.log(result);
        this.onClose();
        this.router.navigate(['/dashboard']);
      };
    })
 
  }

}
