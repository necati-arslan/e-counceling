import { Request, Response } from 'express';
import { getDocData, db } from './database';
import { getSeansType, createOrder } from './helper';


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

interface RequestInfo {
    stripeToken: any,
    roomId: string,
    seansId: string,
    uidTherapist: string,
    seansType?: any,
    userId: string,
    appointmentData?: any,
    IdWorkingTime?: any
}

export async function createCharge(req: Request, res: Response) {

    try {
        console.log('initilaze checkout session');

        const info: RequestInfo = {  //praper data of purchase
            stripeToken: req.body.stripeToken,
            roomId: req.body.roomId,
            seansId: req.body.seansId,
            uidTherapist: req.body.uidTherapist,
            seansType: req.body.seansType,
            userId: req['uid'],
            appointmentData: req.body.appointmentData,
            IdWorkingTime: req.body.IdWorkingTime,
        };

       // console.log(info)

        if (!info.userId) { //check auth
            const message = 'User must be authenticated.';
            console.log(message);
            res.status(403).json({ message });
            return;
        }

        const isAppointment = info.appointmentData ? true : false;
      //  console.log('isAppointment>>>>>', isAppointment);


        //console.log(info);

        const purchaseSessionsData: any = {//for purchase  data
            status: 'ongoing',
            created: Date.now(),
            roomId: info.roomId,
            seansId: info.seansId,
            seansType: info.seansType,
            uidTherapist: info.uidTherapist,
            isAppointment,
            userId: info.userId

        };

        if (isAppointment) {
            purchaseSessionsData.appointmentData = info.appointmentData;
            purchaseSessionsData.IdWorkingTime = info.IdWorkingTime
        }

        const purchaseSession = await db.collection('purchaseSessions').doc();

        await purchaseSession.set(purchaseSessionsData);

        //////

        let seansPrice = await getSeansType(info.seansType.name);
        //console.log(seansPrice);

        const user = await getDocData(`users/${info.userId}`);

        let stripeCustomerId = user ? user.stripeCustomerId : undefined;
       
         // Create a Customer:
         let customer;
         if(stripeCustomerId){
            customer= await stripe.customers.retrieve(stripeCustomerId)
         }else{
            customer = await stripe.customers.create({
                source: info.stripeToken.id,
                email: user.email
            });
         }
         
         
            
        


        let chargeConfig = cargeConfigData(info, seansPrice,customer);

        //console.log('chargeConfig>>>>', chargeConfig)

        stripe.charges.create(chargeConfig)
            .then(chargeObject => {
                createOrder(chargeObject, purchaseSession,customer)
                    .then(order => {

                        if (order) {
                            console.log('order.....', order);
                            res.status(200).json(order).end();
                            stripe.charges.capture(chargeObject.id)
                                .then(res => { console.log('xxxxxxxxxxxxxxxxxxx', res); return res })
                                .catch(err => { console.log(err); return err })
                        }

                    })
                    .catch(error => {
                        console.log('error>>>', error);
                        res.status(400).json(error).end();
                        stripe.refunds.create({ charge: chargeObject.id })
                            .then(res => res)
                            .catch(err => err);
                    });

            }).catch(error => {
                console.log(error);
            });




    }
    catch (error) {
        console.log(error, 'not create charge');
        res.status(500).json({ error });

    }

}


function cargeConfigData(info: RequestInfo, seansPrice: number,customer:any) {

    let data = {
        amount: 100,
        currency: 'usd',
        capture: false,  // note that capture: false
        customer: customer.id
    }

    return data;


}