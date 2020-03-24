import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, take, first, filter, mergeMap } from 'rxjs/operators';
import { combineLatest, of, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { promise } from 'protractor';
import { resolve } from 'url';
import { Router } from '@angular/router';
import { fromPromise } from 'rxjs/internal-compatibility';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router,
    private auth: AuthService
  ) { }

  getTherapistAllInfoById(uidTherapist): Observable<any> {
    return this.afs.collection('users').doc(uidTherapist).valueChanges()
      .pipe(
        filter(user => !!user),
        switchMap((user: any) => this.getTherapistById(user.uid, user))
      );
  }

  getTherapistById(userId, data?: any) {//tick
    return this.afs.collection('therapists').doc(userId).valueChanges()
      .pipe(
        map((therapist: any) => {
          if (!therapist) return null
          let therapistAllInfo = { ...data ? data : null, ...therapist };
          return therapistAllInfo;
        })
      )
  }


  async creatRoom(therapist: any, user: any, seansType: any, bilgi, question) {
    const uiduser = user.uid;
    const uidtherapist = therapist.uidtherapist;
    let roomRef: any;
    console.log(seansType);

    const dataRoom = {
      uidtherapist: uidtherapist,
      uiduser: uiduser,
      createdAt: Date.now()
    }


    const checkRoom: any = await this.checkRoom(uidtherapist, uiduser);

    if (checkRoom != '') roomRef = checkRoom[0];
    else roomRef = await this.afs.collection('rooms').add(dataRoom);
    console.log('roomref', roomRef);///////////
    roomRef = roomRef.id;
    let seansId;

    await this.creatSeans(roomRef, seansType, bilgi, question).then(seansRef => {
      console.log('seansRef', seansRef);
      seansId = seansRef.id;
      console.log('senasRefxxx', seansId);

      if (seansType != "message") {
        this.creatLastSeans(therapist, user, roomRef, seansId, seansType);
        this.creatLogSeans(therapist, user, roomRef, seansId, seansType);
      } else {
        this.creatLastMessageSeans(therapist, user, roomRef, seansId, seansType, question);
        this.creatLogSeans(therapist, user, roomRef, seansId, seansType);
      }

    });

    const seansData = {
      seansType,
      roomRef,
      seansId
    }
    return seansData;

  }

  creatSeans(roomRef, seansType, bilgi, question) {
    const data = {
      createdAt: Date.now(),
      count: 0,
      type: seansType,
      messages: [],
      state: "continuing",
      bilgi: bilgi ? bilgi : null,
      question: question ? question : null
    };
    return this.afs.collection(`rooms/${roomRef}/seans`).add(data);
  }


  creatLastSeans(therapist, user, roomId, seansId, seansType) {
    const uidTherapist = therapist.uidtherapist;
    const uidUser = user.uid;

    const dataTherapist = {
      roomId: roomId,
      seansId: seansId,
      type: seansType,
      createdtime: Date.now(),
      state: 'continuing',
      userId: uidUser,
      userdisplayname: user.displayName ? user.displayName : ''
    }
    const dataUser = {
      roomId: roomId,
      seansId: seansId,
      type: seansType,
      createdtime: Date.now(),
      state: 'continuing',
      uidtherapist: uidTherapist,
      therapistname: therapist.displayName
    }

    this.afs.doc(`therapists/${uidTherapist}/lastseans/seansLive`).set(dataTherapist);
    this.afs.doc(`users/${uidUser}/lastseans/seansLive`).set(dataUser);

  }

  creatLastMessageSeans(therapist, user, roomId, seansId, seansType, question) {
    const uidTherapist = therapist.uidtherapist;
    const uidUser = user.uid;
    const dataTherapist = {
      roomId: roomId,
      seansId: seansId,
      type: seansType,
      createdtime: Date.now(),
      state: 'continuing',
      uiduser: uidUser,
      uidtherapist: uidTherapist,
      userdisplayname: user.displayName ? user.displayName : '',
      usermail: user.email,
      photoURL: user.photoURL,
      question: question
    }
    const dataUser = {
      roomId: roomId,
      seansId: seansId,
      type: seansType,
      createdtime: Date.now(),
      state: 'continuing',
      uidtherapist: uidTherapist,
      uiduser: uidUser,
      therapistname: therapist.displayName,
      photoURL: therapist.photoURL,
      question: question
    }

    this.afs.collection(`therapists/${uidTherapist}/lastquestion`).add(dataTherapist);
    this.afs.collection(`users/${uidUser}/lastquestion`).add(dataUser);
  }
  creatLogSeans(therapist, user, roomId, seansId, seansType) {
    const uidTherapist = therapist.uidtherapist;
    const uidUser = user.uid;
    this.afs.collection("logSeans").add({ uidTherapist, uidUser, roomId, seansId, seansType });
  }


  checkRoom(uidtherapist, uiduser) {
    return this.afs.collection('rooms', ref => ref.where('uiduser', '==', uiduser)
      .where('uidtherapist', '==', uidtherapist)).snapshotChanges()
      .pipe(take(1),
        map(snaps => {
          return snaps.map((snap: any) => {
            return {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
        })
      ).toPromise()
  }

  getAllMessage(uiduser,userType){

    return this.getRooms(uiduser,userType).pipe(
      switchMap(rooms=>this.getQuestionFromRooms(rooms)),
      map((seans: any) => {
        let seansInfo = []
        console.log(seans);
        seans = seans.filter(s => {
          console.log(s[0]);
          return s[0] != null;
        })
        seans.forEach((s1: any) => {
          s1.forEach((s2: any) => {
            seansInfo.push(s2);
          })
        })

        seansInfo.sort(function (a, b) {
          return b.createdAt - a.createdAt;
        });
        console.log(seansInfo)
        return seansInfo
      })
    )
  }

  getRoomsByUid(uiduser, userType): Observable<any> {//silinecek

    let roomsInfo = {}
    let whichUser;
    if (userType == 'user') whichUser = 'uiduser';
    if (userType != 'user') whichUser = 'therapist.uidtherapist';

    return this.afs.collection('rooms', ref => ref.where(whichUser, '==', uiduser)
    ).snapshotChanges()
      .pipe(
        switchMap((rooms: any) => {
          const seansInfo = rooms.map((room: any) => {
            let data;
            data = {
              roomId: room.payload.doc.id,
              ...room.payload.doc.data()
            }
            console.log(data.roomId)
            roomsInfo[data.roomId] = data
            return this.getQuestion(data.roomId, data)
          })
          return seansInfo.length ? combineLatest(seansInfo) : of([]);
        }),
        map((seans: any) => {
          let seansInfo = []
          console.log(seans);
          seans = seans.filter(s => {
            console.log(s[0]);
            return s[0] != null;
          })
          seans.forEach((s1: any) => {
            s1.forEach((s2: any) => {
              seansInfo.push(s2);
            })
          })

          seansInfo.sort(function (a, b) {
            return b.createdAt - a.createdAt;
          });
          console.log(seansInfo)
          return seansInfo
        }),


      )

  }



  getQuestionFromRooms(rooms) {
    let roomId;
    let seansInfo = rooms.map((rooms: any) => {
      roomId = rooms.roomId
      return this.getQuestion(roomId, rooms)
    })
    return seansInfo.length ? combineLatest(seansInfo) : of([]);

  }

  getQuestion(roomId, data) {
    return this.afs.collection(`rooms/${roomId}/seans`, ref => ref.where('type', '==', 'message')).snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map((snap: any) => {
            return {
              uiduser: data.uiduser,
              uidtherapist: data.uidtherapist,
              room: data,
              roomId: roomId,
              seansId: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
        })
      );
  }
  getLastQuestion(userId, userType) {
    if (userType == 'user') userType = 'users';
    if (userType == 'therapist') userType = 'therapists';
    return this.afs.collection(`${userType}/${userId}/lastquestion`, ref => ref.orderBy('createdtime', "desc")).valueChanges();

  }
  getLastQuestionCountForUser(userId) {
    return this.afs.collection(`users/${userId}/lastquestion`, ref => ref.where('state', "==", "finished")).valueChanges();
  }


  addAnswer(roomId, seansId, answer) {
    return fromPromise(this.afs.doc(`rooms/${roomId}/seans/${seansId}`).update({ answer, state: 'finished' }));
  }

  addReadState(roomId, seansId, readState) {
    return fromPromise(this.afs.doc(`rooms/${roomId}/seans/${seansId}`).update({ readState }));
  }

  getRefLastMessage(seansId, uiduser, whichUser = 'users') {

    return this.afs.collection(`${whichUser}/${uiduser}/lastquestion`, ref => ref.where('seansId', '==', seansId))
      .snapshotChanges().pipe(
        take(1),
        map((snaps: any) => {
          if (!snaps) return of(null);
          let seansIdRef;
          snaps.forEach((snap: any) => {
            seansIdRef = snap.payload.doc.id
          })
          console.log(seansIdRef);
          return seansIdRef;
        })
      )

  }
  updateLastMessageUser(uiduser, refId, answer) {
    if (refId) {
      return fromPromise(this.afs.doc(`users/${uiduser}/lastquestion/${refId}`).update({ answer, state: 'finished' }))
    } else { return of(null) }
  }
  deleteLastMessageTherapist(uidTherapist, refTId) {
    if (refTId) {
      return fromPromise(this.afs.doc(`therapists/${uidTherapist}/lastquestion/${refTId}`).delete())
    } else { return of(null) }
  }
  deleteLastMessageUsers(uidUser, refId) {
    if (refId) {
      return fromPromise(this.afs.doc(`users/${uidUser}/lastquestion/${refId}`).delete())
    } else { return of(null) }
  }

  joinUser(observe$: Observable<any>, userType = "user") {

    const joinKey = {};
    let data;
    return observe$.pipe(
      switchMap((snaps: any) => {
        data = snaps;
        const userInfo = snaps.map((snap: any) => {
          if (!snap) return;
          let uid;
          if (userType == "user") uid = snap.uidtherapist ? snap.uidtherapist : snap.therapist.uidtherapist;//not check
          if (userType != "user") uid = snap.uiduser;
          return this.auth.getUserById(uid);
        })
        return userInfo.length ? combineLatest(userInfo) : of([]);
      }),
      map((users: any) => {
        users.forEach(user => {
          joinKey[user.uid] = user;
        });
        let uid;

        return data.map((element: any) => {
          if (userType == "user") uid = element.uidtherapist ? element.uidtherapist : element.therapist.uidtherapist;// not check
          if (userType != "user") uid = element.uiduser;
          return { ...element, ...joinKey[uid] }
        });
      })
    )
  }

  getRoomById(roomId) {
    return this.afs.doc(`rooms/${roomId}`).valueChanges()
  }

  getRooms(userId, userType = 'uiduser') {//{id: "Staam8232Mvzm1aSqiqH", createdAt: 1573391227287, uidtherapist: "s4LiWMGJSfavBcmg7Zy9UBbCkxH2", uiduser: "XgdaPpePthXbgBToO5TueJXfuio2"}

    if (userType == "therapist") userType = 'uidtherapist';
    if (userType == "user") userType = 'uiduser';
    return this.afs.collection('rooms', ref => ref.where(userType, '==', userId)).snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map((snap: any) => {
            return {
              roomId: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
        })
      )
  }

  joinRoomsUsers(userId, userType = 'uiduser') {
    const joinKey = {};
    let roomsInfo;
    return this.getRooms(userId, userType).pipe(
      switchMap((rooms: any) => {
        roomsInfo = rooms
        const userInfo = rooms.map((room: any) => {
          if (!room) return;
          console.log(room.uiduser)
          return this.auth.getUserById(room.uiduser)
        })
        return userInfo.length ? combineLatest(userInfo) : of([]);
      }),
      map((users: any) => {
        users.forEach(user => {
          joinKey[user.uid] = user;
        });
        console.log(joinKey)
        return roomsInfo.map((room: any) => {
          return { ...room, ...joinKey[room.uiduser] }
        });

      })
    )
  }

  getSeans(roomId): Observable<any[]> {
    return this.afs.collection(`rooms/${roomId}/seans/`, ref => ref.orderBy('createdAt', "desc")).snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map((snap: any) => {
            return {
              idSeans: snap.payload.doc.id,
              ...snap.payload.doc.data() 
            }
          })
        })
      );
  }

  getLastSeans(userType, uid, user) {
    let typeCollection;
    if (userType == "therapist") typeCollection = "therapists";
    if (userType == "user") typeCollection = "users";
    console.log(typeCollection);
    return this.afs.doc<any>(`${typeCollection}/${uid}/lastseans/seansLive`).valueChanges()
      .pipe(
        map((lastSeans: any) => {
          console.log(lastSeans);
          if (lastSeans != null) {
            let timeNow = Date.now();
            let createdtime = lastSeans.createdtime;
            let elapsedTime = Math.floor((timeNow - createdtime) / (1000 * 60 * 60));
            let seansState = lastSeans.state;
            console.log(lastSeans)
            console.log(elapsedTime);
            if (elapsedTime > 1) {
              if (seansState == 'continuing' && userType == "user")
                this.afs.doc(`${typeCollection}/${uid}/lastseans/seansLive`).update({ state: 'finished' });

              return lastSeans;
            }
            if (elapsedTime < 1) {

              console.log('mevcut görüşmeniz var!!');
              return lastSeans;
            };
          }
          return of(null);
        })
      );
  }

  getTotalSeans(uidUser) {
    return this.afs.collection('logSeans', ref => ref.where('uidTherapist', '==', uidUser)).valueChanges();
  }

  addSeansNot(roomId, seansId, note) {
    return this.afs.doc(`rooms/${roomId}/seans/${seansId}`).update({ seansNote: note });
  }
  addRoomNot(roomId, note) {
    return this.afs.doc(`rooms/${roomId}`).update({ roomNote: note });
  }

  getAskHelp() {
    return this.afs.collection('askhelp', ref => ref.orderBy('createdAt', "desc")).snapshotChanges().pipe(
      map(snaps => {
        return snaps.map((snap: any) => {
          return {
            askId: snap.payload.doc.id,
            ...snap.payload.doc.data()
          }
        })
      })
    );
  }

  addAskHelp(name, value, createdAt) {
    return this.afs.collection(`askhelp`).add({ name, value, createdAt });
  }
  deleteAskHelp(askId) {
    return this.afs.doc(`askhelp/${askId}`).delete();
  }

  getTherapist(): Observable<any> {
    return this.afs.collection<any>('therapists').valueChanges().pipe(first())
  }


  updateUserInfo(userId, displayName?: string, gender?: string) {
    return this.afs.doc(`users/${userId}/`).update({ gender, displayName, matching: true })
  }

  updateUserAllInfo(userId, obj: object) {
    return this.afs.doc(`users/${userId}/`).update({ ...obj })
  }

  updateTherapistInfo(userId, meslekOzet = "", expertise = "", uzmanlik = "", education = "") {
    return this.afs.doc(`therapists/${userId}`).update({
      meslekOzet: meslekOzet,
      expertise: expertise,
      uzmanlik: uzmanlik,
      education: education
    });

  }


  getAllUser() {//check is in auth
    return this.afs.collection('users/').valueChanges()
  }
  getAllTherapist() {
    return this.afs.collection('users/', ref => ref.where('type', '==', 'therapist')).valueChanges();
  }



}









