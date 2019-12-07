import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { of, Observable,combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor( private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router) { }

    chatRef:string;

    get(roomId,chatId) {
      this.chatRef=`rooms/${roomId}/seans`
      return this.afs
        .collection<any>(this.chatRef)
        .doc(chatId)
        .snapshotChanges()
        .pipe(
          map(doc => {
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
  
    async sendMessage(chatId, content) {
      const { uid } = await this.auth.getUser(); 
  
      const data = {
        uid,
        content,
        createdAt: Date.now()
      };
  
      if (uid) {
        const ref = this.afs.collection(this.chatRef).doc(chatId);
        return ref.update({
          messages: firestore.FieldValue.arrayUnion(data)
        });
      }
    }


    joinUsers(chat$: Observable<any>) {
      let chat;
      const joinKeys = {};
    
      return chat$.pipe(
        switchMap((c:any) => {
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
        map((arr:any) => {
          console.log(arr);//[{Observable1.subcribe},{{Observable1.subcribe}}{{Observable1.subcribe}}]
          arr.forEach(v => (joinKeys[(<any>v).uid] = v));//match uid with user info
          chat.messages = chat.messages.map(v => {
            return { ...v, user: joinKeys[v.uid] };//chat messege redesign
          });
    
          return chat;
        })
      );
    }





    
}
