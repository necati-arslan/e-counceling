import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VideoAudioService } from './video-audio.service';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';
import { UiService } from '../ui-service.service';

@Component({
  selector: 'app-video-audio', 
  templateUrl: './video-audio.component.html',
  styleUrls: ['./video-audio.component.css']
})
export class VideoAudioComponent implements OnInit {


  seansInfo: any;
  @Input('seansId') seansId: string;

  @Input('roomId') roomId: any;

  @Input('Advisee') Advisee:any

  localCallId: string = "localStream";
  remoteCallId: string = "remoteStream";

  user: any;
  userId;

  rtc: any = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    waiting: false,
    params: {},
    romoteChatch: false
  };

  // Options for joining a channel
  option = {
    channel: "ChannelTest",
    uid: null,
    token: null
  };

  constructor(
    private videoService: VideoAudioService,
    private authService: AuthService,
    private roomService: RoomService
  ) { }

  ngOnInit() {

    this.videoService.createClient(this.rtc);
    this.videoService.handleEvents(this.rtc, this.remoteCallId);

    this.authService.userSubject$.subscribe(user => {
      this.user = user;
      this.userId=user.uid;
      this.videoService.getSeansByID(this.roomId, this.seansId).subscribe(seans => {
        this.seansInfo = seans;
        console.log(this.seansInfo)
     
       if (this.user.type == "user" && this.seansInfo.startedTime) this.clientInit();
        if (this.seansInfo.state=="finished") this.leave();
      })

    })

  }


  clientInit() {
    console.log(this.rtc)
    

    if (this.user.type == "therapist") {
   
      if (!this.seansInfo.startedTime) {
        let data = { startedTime: Date.now() };
        this.roomService.updateSeans(this.roomId, this.seansId, data);
        this.roomService.updateLastSeansTherapist(this.userId,this.seansId,data,this.Advisee);
      }


    } 

    if (this.user.type == "user" && !this.seansInfo.startedTime) {     
        this.rtc.waiting =true;
        return;
      }
    
    if (this.seansInfo.state=="finished") return;


    this.videoService.clientInit(this.rtc, this.seansId, this.localCallId, this.seansInfo.type);
  }

  leave() {
    this.videoService.leave(this.rtc)
  }

  fullscreen() {
    const docElmWithBrowsersFullScreenFunctions = document.querySelector("#remoteStream") as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    //let elem = document.querySelector("#remoteStream");
    // console.log(elem.innerHTML)
    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }

  }

 

 


}
