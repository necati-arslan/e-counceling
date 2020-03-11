import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

interface StatusData {
  stateLive:string,
  last_changed:any
}

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  // Firestore uses a different server timestamp value, so we'll 
// create two more constants for Firestore state.

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private afStore: AngularFirestore) {
    console.log('let there be presence');
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }

  getPresence(uid: string) {
    return this.db.object(`status/${uid}`).valueChanges();

  }

  getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async setPresence(statusData: StatusData) {
    const user = await this.getUser();

    if (user) {
     // this.afStore.collection('users').doc(user.uid).update({ ...statusData});
      return this.db.object(`status/${user.uid}`).update({ ...statusData});

    }
  }

  isOfflineForDatabase = {
    stateLive: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

 isOnlineForDatabase = {
    stateLive: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};
isAwayForDatabase = {
  stateLive: 'away',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};
  

  // Updates status when logged-in connection to Firebase starts
  updateOnUser() {
    const connection = this.db.object('.info/connected').valueChanges().pipe(
      map(connected => connected ? 'online' : 'offline')
    );

    return this.afAuth.authState.pipe(
      switchMap(user => user ? connection : of('offline')),
      tap(status => {
        if (status=="online") {this.setPresence(this.isOnlineForDatabase)}
        else {this.setPresence(this.isOfflineForDatabase)}
    })
    );
  }

  // User navigates to a new tab, case 3
  updateOnAway() {
    document.onvisibilitychange = (e) => {

      if (document.visibilityState === 'hidden') {
        this.setPresence(this.isAwayForDatabase);
      } else {
        this.setPresence(this.isOnlineForDatabase);
      }
    };
  }

  updateOnDisconnect() {
    return this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.db.object(`status/${user.uid}`).query.ref.onDisconnect()
            .update(this.isOfflineForDatabase);
            
        }
      })
    );
  }

  async signOut() {
    await this.setPresence(this.isOfflineForDatabase);
    await this.afAuth.auth.signOut();
  }


}
