import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { map, switchMap, first, take } from 'rxjs/operators';
import { User } from './user.model';
import { PresenceService } from '../presence/services/presence.service';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable()
export class AuthService {

  authUserS = new Subject<User>();
  user$: Observable<any>;

  constructor(
    private afauth: AngularFireAuth,
    private router: Router,
    private presence: PresenceService,
    private afs: AngularFirestore
  ) {

    this.user$ = this.afauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges().pipe(take(1));
        } else {
          return of(null);
        }
      })
    );

  }

  saveuser(data) {
    this.afs.collection('users').doc(data.uid).set({ ...data });
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  getLastSeans(userType) {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          console.log(userType)
          return this.afs.doc<any>(`${userType}/${user.uid}/lastseans/chat`).valueChanges()
            .pipe(
              map(snaps => {
                return { ...snaps, ...user }
              })
            );
        } else {
          return of(null);
        } 
      })
    );
  }

  checkLastSeans(userType) {//map kullanılacak
    return this.getLastSeans(userType).pipe(
      map((lastSeans: any) => {
        if (lastSeans != null) {
          let timeNow = Date.now();
          let createdtime = lastSeans.createdtime;
          let elapsedTime = Math.floor((timeNow - createdtime) / (1000 * 60 * 60));
          let seansState = lastSeans.seansstate;
          console.log(lastSeans)
          if (elapsedTime > 1 && seansState == 'continuing') {
            this.afs.doc(`${userType}/${lastSeans.uid}/lastseans/chat`).update({ seansstate: 'finished' });
            return lastSeans;
          }
          if (elapsedTime < 1) {
            console.log('mevcut görüşmeniz var!!');
            return lastSeans;
          };
        }
      })
    );

  }


  initAuthListener() {
    this.afauth.authState.subscribe(user => {
      if (user) {
        let email = user.email;
        let uid = user.uid;
        let data = { email, uid }
        this.authUserS.next({ ...data });

      } else {
        this.authUserS.next(null);
      }

    })


  }

  registerUser(authData: AuthData) {
    return this.afauth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password);
  }

  login(authData: AuthData) {
    return this.afauth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
  }

  logout() {
    this.presence.signOut();
    this.afauth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }



}