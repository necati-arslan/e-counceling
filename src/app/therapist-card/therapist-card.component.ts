import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, of, forkJoin, combineLatest, concat, merge, zip } from 'rxjs';
import { RoomService } from '../services/room.service';
import { switchMap, map, filter, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeansPaymentComponent } from '../seans-payment/seans-payment.component';
import { MatDialog } from '@angular/material/dialog';


interface Status {
  state: string,
  seansstate: string
}

@Component({
  selector: 'app-therapist-card',
  templateUrl: './therapist-card.component.html',
  styleUrls: ['./therapist-card.component.css']
})


export class TherapistCardComponent implements OnInit, OnChanges {

  therapistCard$: Observable<any>;
  @Input() uidTherapist: any[];
  @Input() userAuth: any;


  status: string = "offline";

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private afs: AngularFirestore,
    private dialog:MatDialog
  ) {

    // let arr = ['WdFWd0Q7YGV4A3xiAZ53MS2fEWR2', 's4LiWMGJSfavBcmg7Zy9UBbCkxH2']
    // combineLatest(arr.map(y => {
    //   return merge(this.roomService.getTherapistAllInfoById(y),
    //     this.getStatus(y)
    //   );
    // })).subscribe(x => console.log(x))

    // this.roomService.getTherapistAllInfoById("s4LiWMGJSfavBcmg7Zy9UBbCkxH2").subscribe(x => console.log(x));
  }

  ngOnInit() {
    // this.therapistCard$.subscribe(x=>console.log(x));
    // console.log(this.uidTherapist);
    // this.authService.getStatus(this.uidTherapist).subscribe(x=>console.log(x))
    // this.roomService.getTherapistAllInfoById(this.uidTherapist).subscribe(x=>console.log(x));
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    let value = changes.uidTherapist.currentValue;
    let uidTherapist;
    if (typeof value == 'string') {//for single therapist
      let data = { uidtherapist: value }
      uidTherapist = Array.from(new Set([data]));
    } else {
      uidTherapist = value;
    } 
    console.log(uidTherapist)
    this.therapistCard$ = combineLatest(
      uidTherapist.map((element: any) => {
        console.log(element.uidtherapist)
        return this.roomService.getTherapistAllInfoById(element.uidtherapist).pipe(
          switchMap((infoTherapist: any) => {
            //console.log(infoTherapist);
            return this.getStatus(element.uidtherapist).pipe(map(status => {
              console.log(status)
              let dataStatus;
              status ? dataStatus = status : dataStatus = { status: 'offline' };
              return { ...infoTherapist, ...dataStatus };
            }))
          }));
      })).pipe( 
        map(x => {
          return x.filter(Boolean)
        }),
        tap(x => console.log(x))
      );


  }

  getStatus(uid) {
    return this.authService.getStatus(uid).pipe(
      map((status: Status) => {
        if (status.state == 'offline') { return { status: 'offline' }; };
        if (status.state == "online" && status.seansstate == "finished") return { status: 'online' };
        if (status.state == "away" || (status.seansstate == "continuing" && status.state == "online")) return { status: 'busy' };
      }));
  }

  seansPayment(therapist){

    const dialogRef = this.dialog.open(SeansPaymentComponent,{
      data:{therapist,user:this.userAuth}
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
