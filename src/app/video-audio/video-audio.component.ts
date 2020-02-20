import { Component, OnInit, Input } from '@angular/core';
import { VideoAudioService } from './video-audio.service';

@Component({
  selector: 'app-video-audio',
  templateUrl: './video-audio.component.html',
  styleUrls: ['./video-audio.component.css']
})
export class VideoAudioComponent implements OnInit {

  @Input('seansId') seansId:string;
  localCallId:string="localStream";
  remoteCallId:string="remoteStream";


  rtc: any = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    waiting:false,
    params: {}
  };

  // Options for joining a channel
  option = {
    channel: "ChannelTest",
    uid: null,
    token: null
  };

  constructor(
    private videoService:VideoAudioService
  ) { }

  ngOnInit() {
    
    this.videoService.createClient(this.rtc);
    this.videoService.handleEvents(this.rtc,this.remoteCallId);
    

  }


  clientInit(){
    this.videoService.clientInit(this.rtc,this.seansId,this.localCallId);  
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
 