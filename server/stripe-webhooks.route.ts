import { Request, Response } from 'express';
import { db, getDocData } from './database';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function stripeWebhooks(req: Request, res: Response) {

    try {
        console.log('initilaizing webhooks>>>>>');
        const signature = req.headers["stripe-signature"];

        const event = stripe.webhooks.constructEvent(
            req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type == "checkout.session.completed") {
            console.log('checkout.session.completed')
            const session = event.data.object;

            console.log(':)))))))))))))))))', session)

            await onCheckoutSessionCompleted(session)


        }

        res.json({ received: true });


    }
    catch{


    }

}

async function onCheckoutSessionCompleted(session) {

    console.log("onCheckoutSessionCompleted");
    const purchaseSessionId = session.client_reference_id;

    console.log(purchaseSessionId);
    const { userId, roomId, seansId, seansType, uidTherapist, isAppointment,appointmentData,IdWorkingTime } =
        await getDocData(`purchaseSessions/${purchaseSessionId}`);

    console.log(userId, roomId, seansId, seansType, uidTherapist,isAppointment,appointmentData,IdWorkingTime);

    await fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId, session.customer);

    const therapist = await getDocData(`users/${uidTherapist}`);
    

    const user = await getDocData(`users/${userId}`);
    
 
    const { status } =
        await getDocData(`purchaseSessions/${purchaseSessionId}`);

    
    if( status!="completed") return;

    if(isAppointment){

        createAppointment(appointmentData,IdWorkingTime)

    }else{
        if (seansType.name != "message") {
            await creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
        } else {
            await creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
        }       
    }

    creatLogSeans(userId,uidTherapist, roomId, seansId, seansType.name,isAppointment )

}


async function fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId, stripeCustomerId) {

    const batch = db.batch();
    console.log(purchaseSessionId)

    const purchaseSessionRef = db.doc(`purchaseSessions/${purchaseSessionId}`);

    batch.update(purchaseSessionRef, { status: "completed" });

    const seansRef = db.doc(`rooms/${roomId}/seans/${seansId}`)
    batch.update(seansRef, { payment: true });

    const userRef = db.doc(`users/${userId}`);

    batch.set(userRef, { stripeCustomerId }, { merge: true });



    return batch.commit();





}

async function creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {

    console.log('creatLastSeans initilizwe');

    const dataLastSeans = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType)


    console.log('dataUser   :', dataLastSeans)



    const therapistRef = db.doc(`therapists/${uidTherapist}/lastseans/seansLive`);
    therapistRef.set({ ...dataLastSeans }).then(() => {
        console.log("therapist seanslive is ok")
    })

    const userRef = db.doc(`users/${userId}/lastseans/seansLive`);
    userRef.set({ ...dataLastSeans }).then(() => {
        console.log("user seanslive is ok")
    })

}


async function creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {

    console.log('creatLastMessageSeans initilizwe');
    const seans = await getDocData(`rooms/${roomId}/seans/${seansId}`);

    let dataLastSeans: any = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);

    dataLastSeans.question = seans.question;

    const therapistRef = db.collection(`therapists/${uidTherapist}/lastquestion`);
    therapistRef.add({ ...dataLastSeans }).then(() => {
        console.log("therapist message seanslive is ok")
    })

    const userRef = db.collection(`users/${userId}/lastquestion`);
    userRef.add({ ...dataLastSeans }).then(() => {
        console.log("user message seanslive is ok")
    })

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

function createAppointment(appointmentData,IdWorkingTime) {

   const appointmentRef= db.collection('appointment');
   appointmentRef.add({...appointmentData}).then(()=>{
       console.log('added an appointment');
   });

   const workingTimeRef= db.doc(`workingTime/${IdWorkingTime}`);
   workingTimeRef.update({reserved:true}).then(()=>{
       console.log('added an workingTime');
   });

}

function creatLogSeans(userId,uidTherapist, roomId, seansId, seansType,isAppointment) {
    const logSeansRef = db.collection('logSeans');
    const createdAt=Date.now();
    logSeansRef.add({ uidTherapist, userId, roomId, seansId, seansType,createdAt,isAppointment});
  }
