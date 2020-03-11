import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { map, switchMap } from 'rxjs/operators';

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
  roomId:string;
  headerUser$;
  seansInfo: any;
  countDownText: any;
  seansId: string;
  roomInfo: any;
  newUserofTherapist;
  otherUser: any;


  seansNote;
  roomNote;



  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private roomService: RoomService
  ) {

  }

  ngOnInit() {

    const roomId = this.route.snapshot.paramMap.get('roomId');
    this.roomId=roomId;
    const seansId = this.route.snapshot.paramMap.get('seansId');
    this.seansId = seansId;
    const source = this.cs.get(roomId, seansId);
    this.chat$ = this.cs.joinUsers(source).pipe(
      map((seansInfo: any) => {
        this.seansInfo = seansInfo;
        if(this.seansInfo.seansNote!=undefined) this.seansNote=this.seansInfo.seansNote;
        let createdAt = this.seansInfo.createdAt + (60 * 60 * 1000)//+1 saat ekle
        this.countDown(createdAt)
        return seansInfo;
      })
    );
    this.auth.getUser().then((user: any) => {
      this.userId = user.uid;
      this.headerUser$ = this.cs.chatHeader(roomId, user.uid).pipe(map(otherUser => {
        console.log(otherUser);
        this.otherUser=otherUser;
        return otherUser;
      }))
    })

    this.roomService.getRoomById(roomId).subscribe((room: any) => {
      if(!room) return;
      this.roomInfo = room;
      if(this.roomInfo.roomNote) this.roomNote=this.roomInfo.roomNote;
      this.isNewUser(room.createdAt);

    })
   

   





  }

  submit(seansId) {

    this.cs.sendMessage(seansId, this.newMsg).then(() => {
      const objDiv = document.getElementById("content");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
    this.newMsg = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }


  countDown(countDownDate) {
    let countInterval = setInterval(() => {

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
      if (distance < 0) {
        clearInterval(countInterval);
        this.countDownText = "Seans Bitti";
      }
    }, 1000);
  }

  isNewUser(createdAt) {
    let now = Date.now();
    let elipsedTime = (now - createdAt) / (60 * 60 * 1000)
    console.log(elipsedTime);
    if (elipsedTime < 1) {
      this.newUserofTherapist = true;
    }
  }

  write(){
    console.log("otheruser",this.otherUser);
    console.log("seans",this.seansInfo);
    console.log("room",this.roomInfo);
  }

  addSeansNote(){
    this.roomService.addSeansNot(this.roomId,this.seansId,this.seansNote).then(()=>{
      document.querySelector('#seansMessage').innerHTML="Seans Notunuz Eklendi..."
    })
  }

  addRoomNote(){
    this.roomService.addRoomNot(this.roomId,this.roomNote).then(()=>{
      document.querySelector('#roomMessage').innerHTML="Genel Notunuz Eklendi..."
    })
  }

}
