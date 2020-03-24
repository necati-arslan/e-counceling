import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VideoAudioService } from './video-audio.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-video-audio',
  templateUrl: './video-audio.component.html',
  styleUrls: ['./video-audio.component.css']
})
export class VideoAudioComponent implements OnInit {



  @Input('seansId') seansId:string;

  @Input('seansInfo') seansInfo:any;
  @Input('roomId') roomId:any;

  localCallId:string="localStream";
  remoteCallId:string="remoteStream";

  user:any;

  rtc: any = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    waiting:false,
    params: {},
    romoteChatch:false
  };

  // Options for joining a channel
  option = {
    channel: "ChannelTest",
    uid: null,
    token: null
  };

  constructor(
    private videoService:VideoAudioService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    
    this.videoService.createClient(this.rtc);
    this.videoService.handleEvents(this.rtc,this.remoteCallId);

    this.authService.userSubject$.subscribe(user=>{
      this.user=user
      if(user.type=='user') this.clientInit();
    })
    

  }


  clientInit(){
    console.log(this.rtc)

    if(this.user.type=="therapist"){
      if(!this.seansInfo.startedTime){
        let data= {startedTime:Date.now()};
        this.videoService.updateSeans(this.roomId,this.seansId,data);
      }
    }
    

    this.videoService.clientInit(this.rtc,this.seansId,this.localCallId,this.seansInfo.type);  
  }

  leave(){
    this.videoService.leave(this.rtc)
  }

  fullscreen(){
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
 