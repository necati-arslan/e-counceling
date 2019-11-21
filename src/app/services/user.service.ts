import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, take, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/userInfo-model';

@Injectable({
  providedIn: 'root' 
})
export class UserService {

  constructor(private db: AngularFirestore,private afauth:AngularFireAuth) { }
  






}
