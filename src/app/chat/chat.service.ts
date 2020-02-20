import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { of, Observable, combineLatest } from 'rxjs';
import { RoomService } from '../services/room.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private afs: AngularFirestore,
    private auth: AuthService,
    private roomService: RoomService,
    private router: Router) { }

  seansRef: string;

  get(roomId, seansId) {
    this.seansRef = `rooms/${roomId}/seans`
    return this.afs
      .collection<any>(this.seansRef)
      .doc(seansId)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  async create() {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('chats').add(data);

    return this.router.navigate(['chats', docRef.id]);
  }

  async sendMessage(seansId, content) {
    const { uid } = await this.auth.getUser();
    console.log(uid);
    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection(this.seansRef).doc(seansId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }


  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap((c: any) => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));//contain user and other users uid

        // Firestore User Doc Reads
        //ther is multi Observable. so that we use combineLatest which is rxjs
        const userDocs = uids.map(u =>//users info from users collection
          this.afs.doc(`users/${u}`).valueChanges()

        );

        return userDocs.length ? combineLatest(userDocs) : of([]);//ther is multi Observable. so that we use combineLatest which is rxjs
      }),
      map((arr: any) => {
        console.log(arr);//[{Observable1.subcribe},{{Observable1.subcribe}}{{Observable1.subcribe}}]
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));//match uid with user info
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };//chat messege redesign
        });
        console.log(chat);
        return chat;
      })
    );
  }


  checkChatHeader(roomId) {
    this.roomService.getRoomById(roomId).pipe(
      map((room: any) => {
        let roo = room;
        console.log('room', roo);
        return roo;

      })
    );
  }

  chatHeader(roomId, userId) {
    return this.roomService.getRoomById(roomId).pipe(
      switchMap(((roomInfo: any) => {
        let therapist = roomInfo.therapist.uidtherapist
        let user = roomInfo.uiduser
        if (user != userId) return this.auth.getUserById(user);
        if (therapist != userId) return this.auth.getUserById(therapist);
        return of(null)
      })
      )
    )
  }



}
