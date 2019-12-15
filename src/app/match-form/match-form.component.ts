import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../services/firestore.service';
import { Therapist } from '../models/therapist-model';

import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../chat/chat.service';
import { AuthService } from '../auth/auth.service';



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
  user:any;
  matching:boolean;
  uidTherapist="s4LiWMGJSfavBcmg7Zy9UBbCkxH2";

  constructor(private frService: FirestoreService,
    private afStore: AngularFirestore,
    private authService:AuthService,
    private chatService: ChatService
  ) {
    this.authService.getUser().then((user:any)=>{
      this.user=user;
      this.matching=user.matching;
    });
   }





  ngOnInit() {

    this.afStore.collection('users').doc('kriLpM9VVyMn8s2LJcjXk8xuutkL2').valueChanges().subscribe(x=>{
      console.log(x)
      if(typeof(x)!==undefined){
        console.log('xxxx');
      }
    });

    this.matchingForm = new FormGroup({
      askHelp: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      nickName:new FormControl(),
      gender:new FormControl()
    });

    this.askHelp$ = this.frService.getAskHelp();


    //console.log(this.uidTherapist);

  }

  async onSubmitMatch() {

    let result: Therapist[];
    let therapistOrder: Therapist[] = [];
    let askHelp: any[];
    let gender=this.matchingForm.value.gender;
    let nickName=this.matchingForm.value.nickName

    if(this.user){
      this.afStore.doc(`users/${this.user.uid}/`).update({gender,nickName,matching:true});
    }

    
          


    //get therapist from firestore and get form selection

    askHelp = this.matchingForm.value.askHelp;
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

    console.log(this.recommendedTherapist);

    // this.recommendedTherapist$ = this.afStore.collection('users', ref => ref.where('type', '==', 'therapist')).valueChanges()
    //   .pipe(
    //     map(snaps => snaps.map((snap: any) => {
    //       console.log(this.recommendedTherapist);
    //       let user = this.recommendedTherapist.find(element => element.uidtherapist == snap.uid)
    //       console.log(user);
    //       return { ...snap, ...user }
    //     }))
    //   );


 
 
  }

  creatChat() {
    this.chatService.create();
  }







}
