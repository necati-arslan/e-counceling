import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-t-dashboard',
  templateUrl: './t-dashboard.component.html',
  styleUrls: ['./t-dashboard.component.css']
})
export class TDashboardComponent implements OnInit {
  lastInfo: any;
  userT$: Observable<any>;
  user: any;
  lastSeans$: Observable<any>;
  totalVideo=0;
  totalAudio=0;
  totalMessage=0;
  totalUser=0;

  constructor(
    private authService: AuthService,
    private roomService: RoomService
  ) {

  }

  ngOnInit() {

    this.authService.user$.subscribe((user: any) => {
      this.user = user;
      this.lastSeans$ = this.roomService.getLastSeans(user.type, user.uid, user)

      this.roomService.getTotalSeans(this.user.uid).subscribe(
        (totalSeans: any) => {
          console.log(totalSeans)
          let totalVideo = totalSeans.filter((seans: any) => {
            return seans.seansType == "video"
          })
          this.totalVideo= totalVideo.length;

          let totalAudio = totalSeans.filter((seans: any) => {
            return seans.seansType == "audio"
          })
          
          this.totalAudio=totalAudio.length;

          let totalMessage = totalSeans.filter((seans: any) => {
            return seans.seansType == "message"
          })
          
          this.totalMessage= totalMessage.length;

          let totalUser = []
          totalSeans.forEach((seans: any) => {
            let roomId = seans.roomId;
            if (!this[roomId]) {
              this[roomId] = seans;
              totalUser.push(this[roomId])
            } 
          }, Object.create(null))

          
           this.totalUser=totalUser.length




        }
      )
    })


    //  this.authService.checkLastSeans('therapists')
    //  .subscribe((lastSeans:any)=>{
    //    if(lastSeans!=null && lastSeans.seansstate=='continuing') {
    //      this.lastInfo=lastSeans;
    //      console.log(lastSeans);
    //     } 
    //   });

  }

} 
