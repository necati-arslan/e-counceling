"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function createCheckoutSession(req, res) {
    try {
        console.log('initilaze checkout session');
        const info = {
            roomId: req.body.roomId,
            seansId: req.body.seansId,
            uidTherapist: req.body.uidTherapist,
            seansType: req.body.seansType,
            userId: req['uid'],
            appointmentData: req.body.appointmentData,
            IdWorkingTime: req.body.IdWorkingTime,
            callbackUrl: req.body.callbackUrl
        };
        if (!info.userId) {
            const message = 'User must be authenticated.';
            console.log(message);
            res.status(403).json({ message });
            return;
        }
        const isAppointment = info.appointmentData ? true : false;
        console.log('isAppointment>>>>>', isAppointment);
        const checkoutSessionData = {
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
            checkoutSessionData.appointmentData = info.appointmentData;
            checkoutSessionData.IdWorkingTime = info.IdWorkingTime;
        }
        const purchaseSession = await database_1.db.collection('purchaseSessions').doc();
        await purchaseSession.set(checkoutSessionData);
        const user = await database_1.getDocData(`users/${info.userId}`);
        let stripeCustomerId = user ? user.stripeCustomerId : undefined;
        let sessionConfigForStripe;
        const therapist = await database_1.getDocData(`users/${info.uidTherapist}`);
        sessionConfigForStripe = setupPurchaseSessionForStripe(info, therapist, purchaseSession.id, stripeCustomerId);
        const session = await stripe.checkout.sessions.create(sessionConfigForStripe);
        console.log('sessionConfigForStripe>>>>>', session);
        res.status(200).json({
            stripeCheckoutSessionId: session.id,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY
        });
    }
    catch (error) {
        console.log('unecpected somting do');
        res.status(500).json({ error: 'could not initiate strip session' });
    }
}
exports.createCheckoutSession = createCheckoutSession;
function setupPurchaseSessionForStripe(info, therapist, purchaseSessionId, stripeCustomerId) {
    const config = setupBaseSessionConfig(info, purchaseSessionId, stripeCustomerId);
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
function setupBaseSessionConfig(info, purchaseSessionId, stripeCustomerId) {
    const config = {
        payment_method_types: ['card'],
        locale: 'auto',
        success_url: `${info.callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${purchaseSessionId}`,
        cancel_url: `${info.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: purchaseSessionId
    };
    if (stripeCustomerId)
        config.customer = stripeCustomerId;
    return config;
}
//# sourceMappingURL=checkout.route.js.map