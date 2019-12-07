import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { RoomService } from '../services/room.service';

interface Status{
  state:string,
  seasstate:string
}

@Component({
  selector: 'app-therapist-card',
  templateUrl: './therapist-card.component.html',
  styleUrls: ['./therapist-card.component.css']
})


export class TherapistCardComponent implements OnInit,OnChanges {

 therapistCard$:Observable<any>;
  @Input() uidTherapist:string;

  status:Status;

  constructor(
    private authService:AuthService,
    private roomService:RoomService
  ) { }

  ngOnInit() {
    // this.therapistCard$.subscribe(x=>console.log(x));
    // console.log(this.uidTherapist);
    // this.authService.getStatus(this.uidTherapist).subscribe(x=>console.log(x))
   // this.roomService.getTherapistAllInfoById(this.uidTherapist).subscribe(x=>console.log(x));
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    let uidTherapist=changes.uidTherapist.currentValue;
    this.authService.getStatus(uidTherapist).subscribe(status=>{this.status=status;})
    this.therapistCard$= this.roomService.getTherapistAllInfoById(uidTherapist);
  }
  

}
