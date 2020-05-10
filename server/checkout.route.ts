import { Request, Response } from 'express';
import { getDocData, db } from './database';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

interface RequestInfo {
    roomId: string,
    seansId: string,
    uidTherapist: string,
    seansType?: any,
    userId:string,
    appointmentData?:any,
    IdWorkingTime?:any,
    callbackUrl: string
}

export async function createCheckoutSession(req: Request, res: Response) {

    try {

        console.log('initilaze checkout session');

        const info: RequestInfo = {  //praper data of purchase
            roomId: req.body.roomId,
            seansId: req.body.seansId,
            uidTherapist: req.body.uidTherapist,
            seansType: req.body.seansType,
            userId:req['uid'],
            appointmentData:req.body.appointmentData,
            IdWorkingTime:req.body.IdWorkingTime,
            callbackUrl: req.body.callbackUrl
        };

        if (!info.userId) { //check auth
            const message = 'User must be authenticated.';
            console.log(message);
            res.status(403).json({ message });
            return;
        }

        const isAppointment =info.appointmentData?true:false;
        console.log('isAppointment>>>>>',isAppointment);


       //console.log(info);

        const checkoutSessionData: any = {//for purchase session data
            status: 'ongoing',
            created: Date.now(),
            roomId: info.roomId,
            seansId: info.seansId,
            seansType:info.seansType,
            uidTherapist: info.uidTherapist,
            isAppointment,
            userId:info.userId
             
        };

        if(isAppointment){
            checkoutSessionData.appointmentData=info.appointmentData;
            checkoutSessionData.IdWorkingTime =info.IdWorkingTime
        }

        const purchaseSession = await db.collection('purchaseSessions').doc();

       // console.log('purchaseSession><<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', purchaseSession.path);
     
        await purchaseSession.set(checkoutSessionData);

        const user = await getDocData(`users/${info.userId}`);

        let stripeCustomerId = user ? user.stripeCustomerId : undefined;

        let sessionConfigForStripe;



        const therapist = await getDocData(`users/${info.uidTherapist}`);
        //console.log('therapist>>>>>', therapist)

        sessionConfigForStripe = setupPurchaseSessionForStripe(info, therapist,
            purchaseSession.id, stripeCustomerId);

        const session = await stripe.checkout.sessions.create(sessionConfigForStripe);
        


       console.log('sessionConfigForStripe>>>>>',session);
        res.status(200).json({
            stripeCheckoutSessionId: session.id,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY
        });


    }
    catch(error){
        console.log('unecpected somting do');
        res.status(500).json({ error: 'could not initiate strip session' })
    }


}


function setupPurchaseSessionForStripe(info: RequestInfo, therapist: any,
    purchaseSessionId: string, stripeCustomerId:string) {
        

    const config: any = setupBaseSessionConfig(info, purchaseSessionId, stripeCustomerId);

    config.line_items = [
        {
            name: therapist.displayName || therapist.email,
            description: info.seansType.label,
            images: [therapist.photoURL],
            amount: info.seansType.price * 100,
            currency: 'try',
            quantity: 1,
        },
    ];

    return config;

}

function setupBaseSessionConfig(info: RequestInfo, purchaseSessionId: string, stripeCustomerId:string) {

    const config: any = {
        payment_method_types: ['card'],
        locale:'auto',
        success_url: `${info.callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${purchaseSessionId}`,
        cancel_url: `${info.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: purchaseSessionId
    };

    if(stripeCustomerId) config.customer=stripeCustomerId;

    return config;
}