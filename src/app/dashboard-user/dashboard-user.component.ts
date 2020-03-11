import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { UserInfo } from '../models/userInfo-model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {

  userinfo: UserInfo;
  lastInfo:any;
  constructor(private frService: FirestoreService,
    private authService:AuthService,
    private router: Router
  ) {


  }

  ngOnInit() {
    this.authService.getUser().then(user => {
      this.userinfo = user;
      console.log(user);
    if (!this.userinfo.matching) return;
     this.router.navigate(['/matching']);
      
    }); 

    // this.authService.checkLastSeans('users')
    // .subscribe((lastSeans:any)=>{
    //   if(lastSeans!=null && lastSeans.seansstate=='continuing') {
    //     this.lastInfo=lastSeans;
    //     console.log(lastSeans);
    //    } 
    //  });
  }

}
