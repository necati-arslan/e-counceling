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


  async creatRoom(therapist: any, user: any,seansType:any,bilgi,question) {
    const uiduser = user.uid;
    const uidtherapist = therapist.uidtherapist;
    let roomRef:any;
    console.log(seansType);

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
    console.log('roomref',roomRef);///////////
    roomRef=roomRef.id;
    let seansId;
    
    await this.creatSeans(roomRef,seansType,bilgi,question).then(chatRef=>{
        console.log('chatRef',chatRef);
        seansId=chatRef.id;
        console.log('senasRefxxx',seansId);

        if(seansType!="message")
        this.creatLastSeans(therapist,user,roomRef,seansId,seansType);
      });
      
     const seansData={
        seansType,
        roomRef,
        seansId
      }
      return seansData;
   
  }

  creatSeans(roomRef,seansType,bilgi,question) {
    const data = {
      createdAt: Date.now(),
      count: 0,
      type:seansType,
      messages: [],
      state: "continuing",
      bilgi:bilgi?bilgi:null,
      question:question?question:null
    };
    return this.afs.collection(`rooms/${roomRef}/seans`).add(data);
  }

  
  creatLastSeans(therapist, user,roomId,seansId,ask){
   const uidTherapist= therapist.uidtherapist;
   const uidUser=user.uid;

    const dataTherapist={
        roomId:roomId,
        chatId:seansId,
        type:ask,
        createdtime:Date.now(),
        seansstate:'continuing',
        userId:uidUser,
        userdisplayname:user.displayName?user.displayName:''
    }
    const dataUser={
        roomId:roomId,
        chatId:seansId,
        type:ask,
        createdtime:Date.now(),
        seansstate:'continuing',
        uidtherapist:uidTherapist,
        therapistname:therapist.name
    }

    this.afs.doc(`therapists/${uidTherapist}/lastseans/seansLive`).set(dataTherapist);
    this.afs.doc(`users/${uidUser}/lastseans/seansLive`).set(dataUser);

  }


  checkRoom(uidtherapist, uiduser) {
    return this.afs.collection('rooms', ref => ref.where('uiduser', '==', uiduser)
      .where('therapist.uidtherapist', '==', uidtherapist)).snapshotChanges()
      .pipe(take(1),
        map(snaps => {
          return snaps.map((snap:any) => {
            return {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
        })
      ).toPromise()
  }

  getRoomById(roomId){
    return this.afs.doc(`rooms/${roomId}`).valueChanges()
  }

  getRooms(userId) {//{id: "Staam8232Mvzm1aSqiqH", createdAt: 1573391227287, uidtherapist: "s4LiWMGJSfavBcmg7Zy9UBbCkxH2", uiduser: "XgdaPpePthXbgBToO5TueJXfuio2"}
    return this.afs.collection('rooms', ref => ref.where('uiduser', '==', userId)).snapshotChanges()
      .pipe(
        map(snaps => { 
          return snaps.map((snap:any) => {
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
