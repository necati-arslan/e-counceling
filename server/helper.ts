import { Request, Response } from 'express';
import { getDocData, db } from './database';
import { error } from 'protractor';


  export async function getSeansType(seansName){

   let seansTypes=await db.collection(`seansPrice`).get();
    let seansDoc;
    seansTypes.forEach(snap => {
      seansDoc= snap.data()
   });
  
   let seansPirce=seansDoc[seansName].price

   return seansPirce;

    }

   



   export async function createOrder(chargeObject:any,purchaseSession:any,customer:any) {
    
        console.log("createOrder.......");
        const purchaseSessionId = purchaseSession.id
    
        console.log(purchaseSessionId);
        const { userId, roomId, seansId, seansType, uidTherapist, isAppointment,appointmentData,IdWorkingTime } =
            await getDocData(`purchaseSessions/${purchaseSessionId}`);
        
    
        console.log(userId, roomId, seansId, seansType, uidTherapist,isAppointment,appointmentData,IdWorkingTime);
    
        await fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId,customer);
    
         const therapist = await getDocData(`users/${uidTherapist}`);
        

         const user = await getDocData(`users/${userId}`);
        
        console.log('therapist',therapist);
 
         const { status } =
            await getDocData(`purchaseSessions/${purchaseSessionId}`);
    
        if( status!="completed") return;

        let order;
        if(isAppointment){
          order= createAppointment(appointmentData,IdWorkingTime,seansType);
        }
        else{
            if (seansType.name != "message") {
                order=  await creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
             
              } else {
                 order=await creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
               
              }       
         }
    
         creatLogSeans(userId,uidTherapist, roomId, seansId, seansType.name,isAppointment );
         return order;
    
    }
    
    
    async function fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId,customer) {
    
        const batch = db.batch();
        console.log(purchaseSessionId)
    
        const purchaseSessionRef = db.doc(`purchaseSessions/${purchaseSessionId}`);
    
        batch.update(purchaseSessionRef, { status: "completed" });
    
        const seansRef = db.doc(`rooms/${roomId}/seans/${seansId}`)
        batch.update(seansRef, { payment: true });

         const stripeCustomerId=customer.id
         
         const userRef = db.doc(`users/${userId}`);
         
         batch.set(userRef, { stripeCustomerId }, { merge: true });
    
        return batch.commit();
    }
    
    async function creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {

        console.log('creatLastSeans initilizwe');
    
        const dataLastSeans = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType)
    
        console.log('dataUser   :', dataLastSeans)
    
        const therapistRef = db.doc(`therapists/${uidTherapist}/lastseans/seansLive`);
        await therapistRef.set({ ...dataLastSeans })
    
        const userRef = db.doc(`users/${userId}/lastseans/seansLive`);
        await userRef.set({ ...dataLastSeans })

        let order={url:'chat',roomId, seansId}
        return order;
    

    }
    
    
    async function creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {


        console.log('creatLastMessageSeans initilizwe');
        const seans = await getDocData(`rooms/${roomId}/seans/${seansId}`);
    
        let dataLastSeans: any = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
    
        dataLastSeans.question = seans.question;
    
        const therapistRef = db.collection(`therapists/${uidTherapist}/lastquestion`);
        await therapistRef.add({ ...dataLastSeans })
    
        const userRef = db.collection(`users/${userId}/lastquestion`);
        await userRef.add({ ...dataLastSeans })
        let order={url:'questiontotherapist'}
        return order;
    

    }
    
    function getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {
        return {
            roomId: roomId,
            seansId: seansId,
            type: seansType.name,
            createdAt: Date.now(),
            state: 'continuing',
            userId: userId,
            userdisplayname: user.displayName ? user.displayName : '',
            uidtherapist: uidTherapist,
            therapistname: therapist.displayName,
            therapistPhotoURL: therapist.photoURL,
            usermail: user.email,
            userPhotoURL: user.photoURL,
        }
        
       
    
    }
    
   async function createAppointment(appointmentData:any,IdWorkingTime,seansType) {

        appointmentData.seansType=seansType;
        const appointmentRef= db.collection('appointment');
        await appointmentRef.add({...appointmentData});
     
        const workingTimeRef= db.doc(`workingTime/${IdWorkingTime}`);
       await workingTimeRef.update({reserved:true});

        let order={url:'appointmentTable'}
        return order;
    
    }
    
    function creatLogSeans(userId,uidTherapist, roomId, seansId, seansType,isAppointment) {
        const logSeansRef = db.collection('logSeans');
        const createdAt=Date.now();
        logSeansRef.add({ uidTherapist, userId, roomId, seansId, seansType,createdAt,isAppointment});
      }