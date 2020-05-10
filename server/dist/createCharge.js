"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const helper_1 = require("./helper");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function createCharge(req, res) {
    try {
        console.log('initilaze checkout session');
        const info = {
            stripeToken: req.body.stripeToken,
            roomId: req.body.roomId,
            seansId: req.body.seansId,
            uidTherapist: req.body.uidTherapist,
            seansType: req.body.seansType,
            userId: req['uid'],
            appointmentData: req.body.appointmentData,
            IdWorkingTime: req.body.IdWorkingTime,
        };
        if (!info.userId) {
            const message = 'User must be authenticated.';
            console.log(message);
            res.status(403).json({ message });
            return;
        }
        const isAppointment = info.appointmentData ? true : false;
        const purchaseSessionsData = {
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
            purchaseSessionsData.IdWorkingTime = info.IdWorkingTime;
        }
        const purchaseSession = await database_1.db.collection('purchaseSessions').doc();
        await purchaseSession.set(purchaseSessionsData);
        let seansPrice = await helper_1.getSeansType(info.seansType.name);
        const user = await database_1.getDocData(`users/${info.userId}`);
        let stripeCustomerId = user ? user.stripeCustomerId : undefined;
        let customer;
        if (stripeCustomerId) {
            customer = await stripe.customers.retrieve(stripeCustomerId);
        }
        else {
            customer = await stripe.customers.create({
                source: info.stripeToken.id,
                email: user.email
            });
        }
        let chargeConfig = cargeConfigData(info, seansPrice, customer);
        stripe.charges.create(chargeConfig)
            .then(chargeObject => {
            helper_1.createOrder(chargeObject, purchaseSession, customer)
                .then(order => {
                if (order) {
                    console.log('order.....', order);
                    res.status(200).json(order).end();
                    stripe.charges.capture(chargeObject.id)
                        .then(res => { console.log('xxxxxxxxxxxxxxxxxxx', res); return res; })
                        .catch(err => { console.log(err); return err; });
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
exports.createCharge = createCharge;
function cargeConfigData(info, seansPrice, customer) {
    let data = {
        amount: 100,
        currency: 'usd',
        capture: false,
        customer: customer.id
    };
    return data;
}
//# sourceMappingURL=createCharge.js.map