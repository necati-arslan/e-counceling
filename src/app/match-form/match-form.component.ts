import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../services/firestore.service';
import { Therapist } from '../models/therapist-model';

import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../chat/chat.service';


@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {
  recommendedTherapist: Therapist[];
  matchingForm: FormGroup;
  recommendedTherapist$: Observable<any>;
  askHelp$: Observable<any>;

  constructor(private frService: FirestoreService,
    private afStore: AngularFirestore,
    private chatService: ChatService
  ) { }





  ngOnInit() {
    this.matchingForm = new FormGroup({
      askHelp: new FormControl('', {
        validators: [
          Validators.required

        ]
      })
    });

    this.askHelp$ = this.frService.getAskHelp();


    //console.log(this.uidTherapist);

  }

  async onSubmitMatch() {

    let result: Therapist[];
    let therapistOrder: Therapist[] = [];
    let askHelp: any[];

    //get therapist from firestore and get form selection

    askHelp = this.matchingForm.value.askHelp
    console.log(askHelp);
    result = await this.frService.getTherapist().toPromise();

    //create score fieald each item
    result.forEach((item) => {
      let intersection = item.expertise.filter(element => askHelp.includes(element));
      let score = intersection.length * 10;
      therapistOrder.push({ ...item, score });
    });

    //sort therapist by score
    therapistOrder.sort(function (a, b) {
      return b.score - a.score;
    });



    this.recommendedTherapist = therapistOrder;


    this.recommendedTherapist$ = this.afStore.collection('users', ref => ref.where('type', '==', 'therapist')).valueChanges()
      .pipe(
        map(snaps => snaps.map((snap: any) => {
          console.log(this.recommendedTherapist);
          let user = this.recommendedTherapist.find(element => element.uidtherapist == snap.uid)
          console.log(user);
          return { ...snap, ...user }
        }))
      );


 

  }

  creatChat() {
    this.chatService.create();
  }







}
