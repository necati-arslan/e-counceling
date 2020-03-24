import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from '../services/room.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-question-template',
  templateUrl: './question-template.component.html',
  styleUrls: ['./question-template.component.css']
})
export class QuestionTemplateComponent implements OnInit {

  answer;
  answerState;
  userType;
  allMessage;

  constructor(
    private roomService: RoomService,
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<QuestionTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.allMessage=this.data.allMessage;
    if (this.data.row.answer) {
      this.answer = this.data.row.answer;
      this.answerState = 'success'
    }
    this.userType = this.data.usertype;
    console.log(this.userType)
    if (this.userType == 'user' && this.answer && !this.allMessage) {
      const readState = true
      const roomId = this.data.row.roomId;
      const seansId = this.data.row.seansId;
      const uiduser = this.data.row.uiduser
      this.roomService.addReadState(roomId, seansId, readState).pipe(
        concatMap(() => this.roomService.getRefLastMessage(seansId, uiduser)),
        concatMap((refId)=>this.roomService.deleteLastMessageUsers(uiduser,refId))
        )
      .subscribe(() => console.log('delete ok'));
    }

  }

  answerClick() {
    const roomId = this.data.row.roomId;
    const seansId = this.data.row.seansId;
    const uiduser = this.data.row.uiduser
    const uidTherapist = this.data.row.uidtherapist
    const whichUser = "therapists"
    const answer = this.answer

    if (this.userType == 'therapist' && !this.allMessage) {
      this.roomService.addAnswer(roomId, seansId, answer).pipe(
        concatMap(() => this.roomService.getRefLastMessage(seansId, uiduser)),
        concatMap((refId) => this.roomService.updateLastMessageUser(uiduser, refId, answer)),
        concatMap(() => this.roomService.getRefLastMessage(seansId, uidTherapist, whichUser)),
        concatMap((refTId) => this.roomService.deleteLastMessageTherapist(uidTherapist, refTId))
      ).subscribe(() => {
        this.answerState = "success";
      });
    }

    if (this.userType == 'therapist' && this.allMessage){
      const seansId = this.data.row.seansId;
      this.roomService.addAnswer(roomId, seansId, answer).pipe(
        concatMap(() => this.roomService.getRefLastMessage(seansId, uiduser)),
        concatMap((refId) => {
          if (refId){return this.roomService.updateLastMessageUser(uiduser, refId, answer)
          }else{
            return of(null)
          }   
        }),
      )
      .subscribe(() => {
        this.answerState = "success";
      });
    }





  }

}
