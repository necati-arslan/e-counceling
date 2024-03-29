import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, first, take,filter,tap, concatMap } from 'rxjs/operators';
import { User } from './user.model';
import { PresenceService } from '../presence/services/presence.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { RoomService } from '../services/room.service';
import { UserInfo } from '../models/userInfo-model';

export const ANONYMOUS_USER: UserInfo = {
  uid: undefined,
  email: undefined,
  type: undefined,
  matching:undefined
}

interface Status {
  stateLive: string,
  seansstate: string,
  state:string,
  isAvaible:boolean
}
 

@Injectable()
export class AuthService {


  user$: Observable<any>;

  private subject = new BehaviorSubject<UserInfo>(undefined);

  userSubject$: Observable<UserInfo> = this.subject.asObservable().pipe(filter(user => !!user));

  isLoggedIn$: Observable<boolean> = this.userSubject$.pipe(map(user => !!user.uid));//çift ünlem boolen yapar.

  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));
 
  constructor(
    private afauth: AngularFireAuth,
    private router: Router,
    private presence: PresenceService,
    private afs: AngularFirestore,
 

  ) {

    // this.user$ = this.afauth.authState.pipe(
    //   switchMap(user => {
    //     console.log(user);
    //     if (user) {
    //       return this.afs.doc<any>(`users/${user.uid}`).valueChanges().pipe(take(1));
    //     } else {
    //       return of(null);
    //     }
    //   }));
 
      this.afauth.authState.pipe(
        switchMap(user => {
          console.log(user);
          if (user) {
            return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })).subscribe(user=>{
          console.log(user);
          this.subject.next(user?user:ANONYMOUS_USER)});
  }

  saveuser(data) {
    let userId = data.uid;
    return this.afs.collection('users').doc(userId).set({ ...data });
  }

  getUser() {
    return this.userSubject$.pipe(first()).toPromise();
  }
  getUserById(userId) {
    return this.afs.doc(`users/${userId}`).valueChanges()
  }
  getUserByIdPromise(userId) {
    return this.afs.doc(`users/${userId}`).valueChanges().toPromise();
  }

  getAvaibleTherapist(uid) { 
    return this.getStatus(uid).pipe(
      map((status: Status) => {
      console.log('>>>>>>>>>>',uid,status)
        if(!status){return {status: 'offline'} }
        if (status.stateLive == 'offline') { return { status: 'offline'}; };
        if(status.isAvaible==false ) return { status: 'busy'};
        if ((status.stateLive == "online" || status.stateLive == "away") && status.state == "finished") return { status: 'online'};
        if ( status.state == "continuing" && (status.stateLive == "online" || status.stateLive == "away")) return { status: 'busy' };
        if ( !status.state && (status.stateLive == "online" || status.stateLive == "away")) return { status: 'online' };
        
      }));
  }


  getStatus(uid, userType = 'therapist') {//{createdtime: "232323", state: "offline", seansstate: "finished"}
    let whichUser = this.getWhichUser(userType);
    let isAvaible;
    let userStatus:any;
    let lastSeansStatus:any;
    
    console.log(whichUser)
    return this.afs.collection(`users/${uid}/status`).valueChanges().pipe(
      switchMap((status: any) => {
        console.log(status)
        userStatus=status[0];
        return this.afs.doc(`${whichUser}/${uid}/lastseans/seansLive`).valueChanges()
      }),
      switchMap(lastSeans=>{
        lastSeansStatus=lastSeans;
        console.log(lastSeans)
        return this.getAvaible(uid);
      }),
      map((avaible:any)=>{
        console.log(avaible)
        avaible?isAvaible=avaible.isAvaible:isAvaible=true; 
        return {...userStatus,...lastSeansStatus,isAvaible}})
    );
  }

  getAvaible(uid){
    return this.afs.doc(`avaible/${uid}`).valueChanges();
  }

  getWhichUser(userType) {
    if (userType == 'user') return 'users';
    if (userType == 'therapist') return 'therapists';
  }



 

  registerUser(authData: AuthData) {

    return this.afauth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result)
        /* Call the SendVerificaitonMail() function when new user sign 
            up and returns promise */
        let dataUser = {
          uid: result.user.uid,
          email: result.user.email,
          type: 'user',
          matching: false,
          displayName: '',
          photoURL: '/assets/userPhoto.png',
          gender: '', 
          createdAt: Date.now()
        }
        this.subject.next(dataUser);
        this.saveuser(dataUser);
        return result;
      })
      .catch(error => {
        console.log(error);
        return error.code;
      })
  }

  login(authData: AuthData) {
    return this.afauth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
  }

  ForgotPassword(passwordResetEmail) {
    return this.afauth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        return "Şifre sıfırlama mailiniz gönderildi.";
      })
      .catch(error => {
        console.log(error);
        return error.code
      });
  }

  facebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afauth.auth
      .signInWithPopup(provider)
      .then(async (result) => {
        let userId = result.user.uid
        let userProvider = result.user
        let isNew = result.additionalUserInfo.isNewUser

        if (isNew) {
          let data = {
            uid: userProvider.uid,
            email: userProvider.email,
            type: 'user',
            matching: false,
            displayName: userProvider.displayName ? userProvider.displayName : '',
            photoURL: userProvider.photoURL ? userProvider.photoURL : '/assets/userPhoto.png',
            gender: '',
            createdAt: Date.now()
          }
          this.saveuser(data);
          return result;
        } else {

          this.getUserById(userId).subscribe((user: any) => {
            if (!user) return;
            let obj: any = new Object();
            if (user.displayName == '' && userProvider.displayName) obj.displayName = userProvider.displayName;
            if (user.photoURL == '' && userProvider.photoURL) obj.photoURL = userProvider.photoURL;
            console.log(obj)
            if (obj != {}) this.updateUserAllInfo(userId, obj);

          })
          return result;
        }
      
      })
      .catch(error => {
        console.log(error);
      });
  }

///////////
  logout() {
    this.presence.signOut();
    this.subject.next(ANONYMOUS_USER)
    this.afauth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
   
  }

  updateUserAllInfo(userId, obj: object) {
    return this.afs.doc(`users/${userId}/`).update({ ...obj })
  }

}