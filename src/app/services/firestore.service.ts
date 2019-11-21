import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { Therapist } from '../models/therapist-model';
import { Observable } from 'rxjs';

@Injectable()
export class FirestoreService {

 
  constructor(private db: AngularFirestore,private afauth:AngularFireAuth) { 

  }

  getAskHelp(){
    return this.db.collection('askhelp').valueChanges();
  }

  getTherapist():Observable<Therapist[]>{
    return this.db.collection<Therapist>('therapists').valueChanges().pipe(first())
  }



}
