import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-t-dashboard',
  templateUrl: './t-dashboard.component.html',
  styleUrls: ['./t-dashboard.component.css']
})
export class TDashboardComponent implements OnInit {
  lastInfo:any;
  constructor(private authService:AuthService) { }

  ngOnInit() {
    
     this.authService.checkLastSeans('therapists')
     .subscribe((lastSeans:any)=>{
       if(lastSeans!=null && lastSeans.seansstate=='continuing') {
         this.lastInfo=lastSeans;
         console.log(lastSeans);
        } 
      });
     
  }

}
