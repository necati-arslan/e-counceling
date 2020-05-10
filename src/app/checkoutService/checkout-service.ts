import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { CheckoutSession } from '../models/CheckoutSession-model';
import { first, filter } from 'rxjs/operators';


declare const Stripe;


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  jwtAuth

  private subject = new BehaviorSubject<any>(undefined);

  chargeInfo$: Observable<any> = this.subject.asObservable();


  constructor(private http: HttpClient,
    private afAuth:AngularFireAuth,
    private afs: AngularFirestore) {  
      afAuth.idToken.subscribe(jwt=>this.jwtAuth=jwt)
    }

    setChargeInfo(data:object){
      this.subject.next(data);
    }

    sendStripeToken(stripeToken,chargeInfo){
      const headers=new HttpHeaders().set('Authorization',this.jwtAuth);
      return this.http.post('/api/charge',{
          stripeToken,
          roomId:chargeInfo.seansRef.roomRef,
          seansId:chargeInfo.seansRef.seansId,
          uidTherapist:chargeInfo.uidTherapist,
          seansType:chargeInfo.seansType,
          appointmentData:chargeInfo.appointmentData,
          IdWorkingTime:chargeInfo.IdWorkingTime,
      },{headers});   
    }
  
    startTherapistCheckoutSession(seansRef:any,uidTherapist:string,seansType,appointmentData:any,IdWorkingTime:any):Observable<CheckoutSession>{
 
      const headers=new HttpHeaders().set('Authorization',this.jwtAuth);

      return this.http.post<CheckoutSession>('/api/checkout',{
          roomId:seansRef.roomRef,
          seansId:seansRef.seansId,
          uidTherapist,
          seansType,
          appointmentData,
          IdWorkingTime,
          callbackUrl:this.buildCallbackUrl()
      },{headers});
  }

  buildCallbackUrl() {

    const protocol = window.location.protocol,
        hostName = window.location.hostname,
        port = window.location.port;

    let callBackUrl = `${protocol}//${hostName}`;

    if (port) {
        callBackUrl += ":" + port;
    }

    callBackUrl+= "/stripe-checkout";

    return callBackUrl;
}

redirectToCheckout(session: CheckoutSession) {

  const stripe = Stripe(session.stripePublicKey);

  stripe.redirectToCheckout({
      sessionId: session.stripeCheckoutSessionId
  });
}

waitForPurchaseCompleted(ongoingPurchaseSessionId: string):Observable<any> {
  return this.afs.doc<any>(`purchaseSessions/${ongoingPurchaseSessionId}`)
      .valueChanges()
      .pipe(
          filter((purchase:any) => purchase.status == "completed"),
          first()
      )
}



}
