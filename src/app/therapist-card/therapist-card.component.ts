import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, of, forkJoin, combineLatest, concat, merge, zip } from 'rxjs';
import { RoomService } from '../services/room.service';
import { switchMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


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


  status: string = "offline";

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    // this.therapistCard$.subscribe(x=>console.log(x));
    // console.log(this.uidTherapist);
    // this.authService.getStatus(this.uidTherapist).subscribe(x=>console.log(x))
    // this.roomService.getTherapistAllInfoById(this.uidTherapist).subscribe(x=>console.log(x));
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    let uidTherapist = changes.uidTherapist.currentValue;
    console.log(uidTherapist)
    this.therapistCard$ = combineLatest(
      uidTherapist.map((element: any) => {
        return zip(this.roomService.getTherapistAllInfoById(element.uidtherapist),
                      this.getStatus("s4LiWMGJSfavBcmg7Zy9UBbCkxH2")
                      );

      })).pipe(map(x => {
       
        console.log(x)
        return x.filter(Boolean);
        
      
      }));



    // uidTherapist.forEach((element:any)=>{
    //   let tStatus;
    //   let infoTherapist;
    //   console.log(element.uidtherapist)

    // if (element.uidtherapist){
    //  this.roomService.getTherapistAllInfoById(element.uidtherapist).subscribe(therapist=>{
    //    console.log(typeof therapist);
    //   // if(therapist){
    //   //     this.therapistCard.push(...therapist);
    //   // }


    //  });
    // }

    // })


  }

  getStatus(uid) {
    return this.authService.getStatus(uid).pipe(
      map((status: Status) => {
        if (status.state == 'offline') { return 'offline'; };
        if (status.state == "online" && status.seansstate == "finished") return 'online';
        if (status.state == "away" || (status.seansstate == "continuing" && status.state == "online")) return'busy';
      }));
  }


}
