import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { RoomService } from '../services/room.service';
import { switchMap, map, filter, tap, concatMap } from 'rxjs/operators';
import { SeansPaymentComponent } from '../seans-payment/seans-payment.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileTherapistComponent } from '../profile-therapist/profile-therapist.component';
 
 
interface Status {
  stateLive: string,
  seansstate: string,
  state:string,
  isAvaible:boolean
}

@Component({
  selector: 'app-therapist-card',
  templateUrl: './therapist-card.component.html',
  styleUrls: ['./therapist-card.component.css']
})


export class TherapistCardComponent implements OnInit {

  therapistCard$: Observable<any>;
  
  @Input() userAuth: any;
  @Input() therapist: any;
  

  status: string = "offline";

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private dialog:MatDialog
  ) {


  }

  ngOnInit() {
    //console.log(this.therapist)
    let uidTherapist=this.therapist.uidtherapist
    this.therapistCard$=this.authService.getUserById(uidTherapist).pipe( 
      filter(user=>!!user),
      switchMap(user=>this.roomService.getTherapistById(uidTherapist,user)),
      concatMap(therapist=>this.getStatus(uidTherapist,therapist))
    )

 
  }
 
 
  getStatus(uid,data?:Object) { 
    if(!data) return of(null); 
    return this.authService.getStatus(uid).pipe(
      map((status: Status) => {
      console.log('>>>>>>>>>>',uid,status)
        if(!status){return {status: 'offline',...data?data:null} }
        if (status.stateLive == 'offline') { return { status: 'offline',...data?data:null }; };
        if(status.isAvaible==false ) return { status: 'busy',...data?data:null };
        if ((status.stateLive == "online" || status.stateLive == "away") && status.state == "finished") return { status: 'online',...data?data:null };
        if ( status.state == "continuing" && (status.stateLive == "online" || status.stateLive == "away")) return { status: 'busy',...data?data:null };
        if ( !status.state && (status.stateLive == "online" || status.stateLive == "away")) return { status: 'online',...data?data:null };
        
      }));
  }
  
  seansPayment(therapist){
 
    const dialogRef = this.dialog.open(SeansPaymentComponent,{
  
      panelClass: 'custom-dialog-container',
      data:{therapist,user:this.userAuth,appointment:false}
    }) 
    .afterClosed()
    .subscribe(result=>{
      if (result) {
        //console.log(result);
        //this.router.navigate(['/dashboard']);
      };
    })

  }
  seansPaymentAppointment(therapist){
 
    const dialogRef = this.dialog.open(SeansPaymentComponent,{
    
      panelClass: 'custom-dialog-container',
      data:{therapist,user:this.userAuth,appointment:true}
    }) 
    .afterClosed()
    .subscribe(result=>{
      if (result) {
       // console.log(result);
        //this.router.navigate(['/dashboard']);
      };
    })

  }

  profileTherapist(therapist){
   // console.log(therapist.uid);
    const dialogRef = this.dialog.open(ProfileTherapistComponent,{
      width:'800px',
      height:'90%',
      panelClass: 'custom-dialog-container',
      data:{therapist}
    }) 
    .afterClosed()
    .subscribe(result=>{
      if (result) {
        console.log(result);
        //this.router.navigate(['/dashboard']);
      };
    })

  }
 

}
