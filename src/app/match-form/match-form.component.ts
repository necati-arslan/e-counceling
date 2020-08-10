import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Therapist } from '../models/therapist-model';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';
import { UiService } from '../ui-service.service';



@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit,OnDestroy {
  recommendedTherapist: Therapist[];
  matchingForm: FormGroup;
  askHelp$: Observable<any>;
  user:any;
  matching:boolean;
  waiting:boolean=false;
  loadingSubject$;
 

  constructor(
    private authService:AuthService,
    private roomService:RoomService,
    private uiService:UiService,
    private cdRef:ChangeDetectorRef
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

  ngAfterViewChecked()
{
  
  this.loadingSubject$= this.uiService.loadingStateChanged.subscribe(value=>this.waiting=value);
  this.cdRef.detectChanges();
}


ngOnDestroy(){
  this.loadingSubject$.unsubscribe();
}


  async onSubmitMatch() {

    let therapists: Therapist[];
    let therapistOrder: Therapist[] = [];
    let askHelp: any[];
   
    this.uiService.loadingStateChangedEmit(true);
  
    
    //get therapist from firestore and get form selection

    askHelp = this.matchingForm.value.askHelp;
    console.log(askHelp);
    therapists = await this.roomService.getTherapist().toPromise();//mutlaka promise olmalı
   
 
    //create score fieald each item
    therapists.forEach((therapist) => {
      if(therapist.expertise){
        let intersection = therapist.expertise.filter(element => askHelp.includes(element));
      let score = intersection.length * 10;
      therapistOrder.push({ ...therapist, score });
      }
      
    });

    //sort therapist by score
    therapistOrder.sort(function (a, b) {
      return b.score - a.score;
    });
 


    this.recommendedTherapist = therapistOrder; 
   
    //console.log(this.recommendedTherapist); 
  }

  






}
