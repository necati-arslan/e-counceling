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
      }));
  }

  saveuser(data) {
    this.afs.collection('users').doc(data.uid).set({ ...data });
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }
  getUserById(userId){
    return this.afs.doc(`users/${userId}`).valueChanges()
  }
  getUserByIdPromise(userId){
    return this.afs.doc(`users/${userId}`).valueChanges().toPromise();
  }


  

  getStatus(uid,userType='therapist') {//{createdtime: "232323", state: "offline", seansstate: "finished"}
      let whichUser=this.getWhichUser(userType);
     console.log(whichUser)
  return this.afs.collection(`users/${uid}/status`).valueChanges().pipe(
      switchMap((status: any) => {
        return this.afs.doc(`${whichUser}/${uid}/lastseans/seansLive`).valueChanges().pipe(
          map((lastSeans:any) => {
            //let stateLive=status[0].state
            let allStatus={...status[0],...lastSeans};
            return allStatus;
            })
        );
      })
    );
  }

  getWhichUser(userType){
    if(userType=='user') return 'users';
    if(userType=='therapist') return 'therapists';
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