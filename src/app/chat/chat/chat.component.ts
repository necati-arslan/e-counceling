import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { map, switchMap } from 'rxjs/operators';
import { VideoAudioService } from 'src/app/video-audio/video-audio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


  chat$: Observable<any>;
  therapist$: Observable<any>;
  newMsg: string;
  userId: string;
  user: any;
  roomId: string;
  headerUser$;
  seansInfo: any;
  countDownText: any = "Henüz başlamadı";
  seansId: string;
  roomInfo: any;
  newUserofTherapist;
  otherUser: any;
  isSeansTimeOut: boolean = false;
  countInterval;
  Advisee;

  seansNote;
  roomNote;



  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private roomService: RoomService,
    private videoService: VideoAudioService
  ) {

  }

  ngOnInit() {

    this.route.paramMap.subscribe((params: ParamMap) => {

      const roomId = params.get('roomId');
      this.roomId = roomId;
      const seansId = params.get('seansId');
      this.seansId = seansId;

      this.isSeansTimeOut=false

      this.auth.userSubject$.subscribe((user: any) => {
        this.userId = user.uid;
        this.user = user;

        const source = this.cs.get(this.roomId, this.seansId);
        this.chat$ = this.cs.joinUsers(source).pipe(
          map((seansInfo: any) => { 
            this.seansInfo = seansInfo;
            console.log(this.seansInfo);
            if (this.seansInfo.seansNote != undefined) this.seansNote = this.seansInfo.seansNote;
            if (this.seansInfo.startedTime) {
              clearInterval(this.countInterval);
              this.countDown(this.seansInfo.startedTime, this.seansInfo.state);
            }
            if (this.user.type == "therapist") {
              this.checkFinishTime(this.seansInfo);
            }

            if (this.seansInfo.state == "finished") this.isSeansTimeOut = true;
            return seansInfo;
          })
        );

        this.headerUser$ = this.cs.chatHeader(this.roomId, this.user.uid).pipe(map(otherUser => {
          console.log(otherUser);
          this.otherUser = otherUser;
          return otherUser;
        }))


        this.roomService.getRoomById(this.roomId).subscribe((room: any) => {
          if (!room) return;
          this.roomInfo = room;
          this.Advisee=room.uiduser;
          if (this.roomInfo.roomNote) this.roomNote = this.roomInfo.roomNote;
          this.isNewUser(room.createdAt);

        })
      })
    })

  }

  submit(seansId) {

    if (this.user.type == "therapist" && this.seansInfo.type == "chat") {
      if (!this.seansInfo.startTime) {
        let data = { startedTime: Date.now() };
        this.roomService.updateSeans(this.roomId, this.seansId, data);
        this.roomService.updateLastSeansTherapist(this.roomId, this.seansId, data,this.Advisee)
      }
    }

    this.cs.sendMessage(seansId, this.newMsg).then(() => {
      const objDiv = document.getElementById("content");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
    this.newMsg = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }


  countDown(startedTime, state) {

    let countDownDate = startedTime + (60 * 60 * 1000)//+1 saat ekle
    if (countDownDate < Date.now() || state == "finished") {
      this.isSeansTimeOut = true
      this.countDownText = "Seans Bitti";
      return;
    }

    this.countInterval = setInterval(() => {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      this.countDownText = minutes + "dk " + seconds + "s ";
      // If the count down is over, write some text 
      if (distance < 0 || state == "finished") {
        clearInterval(this.countInterval);
        this.countDownText = "Seans Bitti";
        this.isSeansTimeOut = true;
      }
    }, 1000);


  }

  isNewUser(createdAt) {//bir saatten azsa oluşturma 
    let now = Date.now();
    let elipsedTime = (now - createdAt) / (60 * 60 * 1000)
    console.log(elipsedTime);
    if (elipsedTime < 1) {
      this.newUserofTherapist = true;
    }
  }

  write() {
    console.log("otheruser", this.otherUser);
    console.log("seans", this.seansInfo);
    console.log("room", this.roomInfo);
  }

  addSeansNote() {
    this.roomService.addSeansNot(this.roomId, this.seansId, this.seansNote).then(() => {
      document.querySelector('#seansMessage').innerHTML = "Seans Notunuz Eklendi..."
    })
  }

  addRoomNote() {
    this.roomService.addRoomNot(this.roomId, this.roomNote).then(() => {
      document.querySelector('#roomMessage').innerHTML = "Genel Notunuz Eklendi..."
    })
  }

  finishSeans(userType?: string) {
    let data = {
      finishedTime: Date.now(),
      state: 'finished'
    }
   
    if (this.seansInfo.finishedTime) return;

    this.roomService.updateSeans(this.roomId, this.seansId, data).then(() => {

      let srt = document.querySelector('#finishMessage');
      srt.innerHTML = "Seans bitirildi";

    })
    this.roomService.updateLastSeansTherapist(this.userId, this.seansId,data,this.Advisee);

  }

  checkFinishTime(seansInfo: any) {
    if (!this.seansInfo.startedTime) return;

    let addedHour = seansInfo.startedTime + (60 * 60 * 1000)//+1 saat ekle
    let now = Date.now();

    if (addedHour < now && !seansInfo.finishedTime) {
      this.finishSeans();
    }
  }



}
