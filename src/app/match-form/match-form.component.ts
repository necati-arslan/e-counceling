import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../services/firestore.service';
import { Therapist } from '../models/therapist-model';

import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../chat/chat.service';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';



@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {
  recommendedTherapist: Therapist[];
  matchingForm: FormGroup;
  askHelp$: Observable<any>;
  user:any;
  matching:boolean;
 

  constructor(
    private authService:AuthService,
    private roomService:RoomService
  ) { 

    this.authService.userSubject$.subscribe((user:any)=>{
      this.user=user;
    });
   }





  ngOnInit() {

    this.matchingForm = new FormGroup({
      askHelp: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    });

    this.askHelp$ = this.roomService.getAskHelp();


  }

  async onSubmitMatch() {

    let therapists: Therapist[];
    let therapistOrder: Therapist[] = [];
    let askHelp: any[];
  
    
    //get therapist from firestore and get form selection

    askHelp = this.matchingForm.value.askHelp;
    console.log(askHelp);
    therapists = await this.roomService.getTherapist().toPromise();//mutlaka promise olmalı
   
 
    //create score fieald each item
    therapists.forEach((therapist) => {
      let intersection = therapist.expertise.filter(element => askHelp.includes(element));
      let score = intersection.length * 10;
      therapistOrder.push({ ...therapist, score });
    });

    //sort therapist by score
    therapistOrder.sort(function (a, b) {
      return b.score - a.score;
    });



    this.recommendedTherapist = therapistOrder; 

    console.log(this.recommendedTherapist); 
  }

  






}
