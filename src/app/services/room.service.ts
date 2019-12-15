import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, take } from 'rxjs/operators';
import { combineLatest, of, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { promise } from 'protractor';
import { resolve } from 'url';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private afs: AngularFirestore,
    private afauth:AngularFireAuth,
    private router:Router 
    ) { }

  getTherapistAllInfoById(uidTherapist):Observable<any> {
    return this.afs.collection('users').doc(uidTherapist).valueChanges()
      .pipe(
        switchMap((user: any) => {
          if(user){
            return this.afs.collection('therapists').doc(user.uid).valueChanges()
            .pipe(
              map(therapist => {
                let therapistAllInfo = { ...user, ...therapist };
                return therapistAllInfo;
              })
            )
          }else {return of(null)}
        })
      );
  }


  async creatRoom(therapist: any, user: any,ask:any) {
    const uiduser = user.uid;
    const uidtherapist = therapist.uidtherapist;
    let roomRef:any;

    const dataRoom = {
      therapist: {
        uidtherapist: uidtherapist,
        therapistname: therapist.name
      },
      uiduser: uiduser,
      createdAt: Date.now()
    }
    

    const checkRoom:any = await this.checkRoom(uidtherapist, uiduser);
    
    if (checkRoom!='') roomRef= checkRoom[0];
    else roomRef = await this.afs.collection('rooms').add(dataRoom);
    roomRef=roomRef.id;
    switch(ask){
      case "chat":
      this.creatSeans(roomRef,ask).then(chatRef=>{
        const chatId=chatRef.id;
        this.creatLastSeans(therapist,user,roomRef,chatId,ask);
        this.router.navigate(['chats',roomRef,chatId]);  
      });
    }
    
  }

  creatSeans(roomRef,ask) {
    const data = {
      createdAt: Date.now(),
      count: 0,
      type:ask,
      messages: [],
      state: "continuing"
    };
    return this.afs.collection(`rooms/${roomRef}/seans`).add(data);
  }

  // creatChat(roomRef) {
  //   const data = {
  //     createdAt: Date.now(),
  //     count: 0,
  //     messages: [],
  //     state: "continuing"
  //   };
  //   return this.afs.collection(`rooms/${roomRef}/chats`).add(data);
  // }
  
  // creatMessage(roomRef) {
  //   const data = {
  //     createdAt: Date.now(),
  //     count: 0,
  //     messages: 'test',
  //     state: "continuing"
  //   };
  //   return this.afs.collection(`rooms/${roomRef}/messages`).add(data);
  // }

  creatLastSeans(therapist, user,roomId,chatId,ask){
   const uidTherapist= therapist.uidtherapist;
   const uidUser=user.uid;

    const dataTherapist={
        roomId:roomId,
        chatId:chatId,
        type:ask,
        createdtime:Date.now(),
        seansstate:'continuing',
        userId:uidUser,
        userdisplayname:user.displayName
    }
    const dataUser={
        roomId:roomId,
        chatId:chatId,
        type:ask,
        createdtime:Date.now(),
        seansstate:'continuing',
        uidtherapist:uidTherapist,
        therapistname:therapist.name
    }

    this.afs.doc(`therapists/${uidTherapist}/lastseans/chat`).set(dataTherapist);
    this.afs.doc(`users/${uidUser}/lastseans/chat`).set(dataUser);

  }


  checkRoom(uidtherapist, uiduser) {
    return this.afs.collection('rooms', ref => ref.where('uiduser', '==', uiduser)
      .where('therapist.uidtherapist', '==', uidtherapist)).snapshotChanges()
      .pipe(take(1),
        map(snaps => {
          return snaps.map(snap => {
            return {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
        })
      ).toPromise()
  }


  getRooms(userId) {//{id: "Staam8232Mvzm1aSqiqH", createdAt: 1573391227287, uidtherapist: "s4LiWMGJSfavBcmg7Zy9UBbCkxH2", uiduser: "XgdaPpePthXbgBToO5TueJXfuio2"}
    return this.afs.collection('rooms', ref => ref.where('uiduser', '==', userId)).snapshotChanges()
      .pipe(
        map(snaps => { 
          return snaps.map(snap => {
            return {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
        })
      )
  }

  getSeans(roomId):Observable<any[]>{
    return this.afs.collection(`rooms/${roomId}/seans/`).snapshotChanges()
    .pipe(
      map(snaps=>{
        return snaps.map(snap=>{
         return {
           idSeans:snap.payload.doc.id,
           ...snap.payload.doc.data()
          }
        })
      })
    );
  }

  

  




}
