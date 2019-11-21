import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RoomService } from '../services/room.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-therapist',
  templateUrl: './therapist.component.html',
  styleUrls: ['./therapist.component.css']
})
export class TherapistComponent implements OnInit {
 
  user:any[];
  uidTherapist:string;
  therapist$:Observable<any>;
  paymentForm:FormGroup;
  room$:Observable<any>;
  ask:string='chat';
  constructor(private route: ActivatedRoute,private roomService:RoomService,private authService:AuthService) { }
 
  ngOnInit() {

    this.uidTherapist = this.route.snapshot.paramMap.get('id');
    this.therapist$ = this.roomService.getTherapistAllInfoById(this.uidTherapist );//therapist
    
    this.authService.getUser().then((user:any)=>{this.user=user;
         this.room$= this.roomService.getRooms(user.uid)
      
    });//user

    this.paymentForm=new FormGroup({
      cardNumber:new FormControl('',{
        validators:[
          Validators.required
      ]}),
      cardName:new FormControl('',{
        validators:[
          Validators.required
      ]}),
      cardCVV:new FormControl('',{
        validators:[
          Validators.required
      ]}),
      message:new FormControl('',{
        validators:[
          Validators.required
      ]})
      
    });

  }

  onSubmitPayment(therapist){
   this.roomService.creatRoom(therapist,this.user,this.ask).then(x=>console.log(x));

  }

  askType(type){
    this.ask=type;
  }


  
}
