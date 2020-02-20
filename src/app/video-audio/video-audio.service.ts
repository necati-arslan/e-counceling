import { Injectable } from '@angular/core';
import AgoraRTC from "agora-rtc-sdk";

@Injectable({
  providedIn: 'root'
})
export class VideoAudioService {
  // rtc object
  appID:string="d8088c13d6504ce2abedb4cf2c02d559"
  constructor() { }
 
  
  
createClient(rtc){
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
  
  }

  clientInit(rtc,channel,localCallId){
    if(!rtc.client) {
      console.log('client not created');
      return;
    }
    rtc.client.init(
      this.appID,
      () => {
        //client init callback
        console.log("init success");
        rtc.client.join(
          null,
          channel,
          null,
          uid => {
            //client join callback
            console.log(
              "join channel: " + channel + " success, uid: " + uid
            );
               
            rtc.joined = true;
            rtc.waiting=true;
            rtc.params.uid = uid;

            // create local stream
            rtc.localStream = AgoraRTC.createStream({
              streamID: rtc.params.uid,
              audio: true,
              video: true,
              screen: false
            });

            console.log("xxxxx", rtc.params.uid);
            // create local stream

            // init local stream
            rtc.localStream.init(
              () => {
                //localStream callback
                console.log("init local stream success");
                // play stream with html element id "local_stream"
                rtc.localStream.play(localCallId);
                // publish local stream
                this.publish(rtc);
              },
              err => {
                //Toast.error("stream init failed, please open console see more detail")
                console.error("init local stream failed ", err);
              }
            );
            // init local stream
          }, //client join callback
          err => {
            console.error("client join failed", err);
          }
        );
        
      }, //client.init function
      err => {
        //client.init error
        console.error(err);
      }
    );

  }

  publish(rtc) {
    if (!rtc.client) {
      //Toast.error("Please Join Room First");
      return;
    }
    if (rtc.published) {
      //Toast.error("Your already published");
      return;
    }
    var oldState = rtc.published;

    // publish localStream
    rtc.client.publish(rtc.localStream, err => {
      rtc.published = oldState;
      console.log("publish failed");
      //Toast.error("publish failed")
      console.error(err);
    });
    //Toast.info("publish")
    rtc.published = true;
    console.log(rtc.published);
  }

  handleEvents(rtc,remoteCallId) {
    // Occurs when an error message is reported and requires error handling.
    rtc.client.on("error", err => {
      console.log(err);
    });
    // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
    rtc.client.on("peer-leave", evt => {
      rtc.waiting=true;
      var id = evt.uid;
      console.log("id", evt);
      if (id != rtc.params.uid) {
        //removeView(id);
        console.log("peer-leave")
        while (rtc.remoteStreams.length > 0) {
          var stream = rtc.remoteStreams.shift();
          var id = stream.getId();
          stream.stop();
          //removeView(id);
        }
        rtc.remoteStreams = [];
      
      }
      //Toast.notice("peer leave")
      console.log("peer-leave", id);
    });
    // Occurs when the local stream is published.
    rtc.client.on("stream-published", function(evt) {
      //Toast.notice("stream published success")
      console.log("stream-published");
    });
    // Occurs when the remote stream is added.
    rtc.client.on("stream-added", evt => {
      var remoteStream = evt.stream;
      var id = remoteStream.getId();
      //Toast.info("stream-added uid: " + id)
      if (id !== rtc.params.uid) {
        rtc.client.subscribe(remoteStream, err => {
          console.log("stream subscribe failed", err);
        });
      }
      console.log("stream-added");
    });
    // Occurs when a user subscribes to a remote stream.
    rtc.client.on("stream-subscribed", evt => {
      rtc.waiting=false;
      var remoteStream = evt.stream;
      var id = remoteStream.getId();
      rtc.remoteStreams.push(remoteStream);
      remoteStream.play(remoteCallId); //show video from here
      //Toast.info('stream-subscribed remote-uid: ' + id);
      console.log("stream-subscribed remote-uid: ", id);
    });
    // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
    rtc.client.on("stream-removed", evt => {
      var remoteStream = evt.stream;
      var id = remoteStream.getId();
      //Toast.info("stream-removed uid: " + id)
      remoteStream.stop(remoteCallId);
      // rtc.remoteStreams = rtc.remoteStreams.filter((stream)=> {
      //   return stream.getId() !== id
      // })
      //removeView(id);
      console.log("stream-removed remote-uid: ", id);
    });
    // rtc.client.on("onTokenPrivilegeWillExpire", function(){
    //   // After requesting a new token
    //   // rtc.client.renewToken(token);
    //   Toast.info("onTokenPrivilegeWillExpire")
    //   console.log("onTokenPrivilegeWillExpire")
    // });
    // rtc.client.on("onTokenPrivilegeDidExpire", function(){
    //   // After requesting a new token
    //   // client.renewToken(token);
    //   Toast.info("onTokenPrivilegeDidExpire")
    //   console.log("onTokenPrivilegeDidExpire")
    // })
  }

  
  leave(rtc) {
    if (!rtc.client) {
      //Toast.error("Please Join First!");
      return;
    }
    if (!rtc.joined) {
      //Toast.error("You are not in channel");
      return;
    }
    /**
     * Leaves an AgoraRTC Channel
     * This method enables a user to leave a channel.
     **/
     
    rtc.client.leave(()=> {
        // stop stream
        rtc.localStream.stop();
        // close stream
        rtc.localStream.close();
        while (rtc.remoteStreams.length > 0) {
          var stream = rtc.remoteStreams.shift();
          var id = stream.getId();
          stream.stop();
          //removeView(id);
        }
        rtc.localStream = null;
        rtc.remoteStreams = [];
        //rtc.client = null;
        console.log("client leaves channel success");
        rtc.published = false;
        rtc.joined = false;
        //Toast.notice("leave success");
      },
      (err)=> {
        console.log("channel leave failed");
        //Toast.error("leave success");
        console.error(err);
      }
    );
  }

}
