"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function stripeWebhooks(req, res) {
    try {
        console.log('initilaizing webhooks>>>>>');
        const signature = req.headers["stripe-signature"];
        const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type == "checkout.session.completed") {
            console.log('checkout.session.completed');
            const session = event.data.object;
            console.log(':)))))))))))))))))', session);
            await onCheckoutSessionCompleted(session);
        }
        res.json({ received: true });
    }
    catch (_a) {
    }
}
exports.stripeWebhooks = stripeWebhooks;
async function onCheckoutSessionCompleted(session) {
    console.log("onCheckoutSessionCompleted");
    const purchaseSessionId = session.client_reference_id;
    console.log(purchaseSessionId);
    const { userId, roomId, seansId, seansType, uidTherapist, isAppointment, appointmentData, IdWorkingTime } = await database_1.getDocData(`purchaseSessions/${purchaseSessionId}`);
    console.log(userId, roomId, seansId, seansType, uidTherapist, isAppointment, appointmentData, IdWorkingTime);
    await fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId, session.customer);
    const therapist = await database_1.getDocData(`users/${uidTherapist}`);
    const user = await database_1.getDocData(`users/${userId}`);
    const { status } = await database_1.getDocData(`purchaseSessions/${purchaseSessionId}`);
    if (status != "completed")
        return;
    if (isAppointment) {
        createAppointment(appointmentData, IdWorkingTime);
    }
    else {
        if (seansType.name != "message") {
            await creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
        }
        else {
            await creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
        }
    }
    creatLogSeans(userId, uidTherapist, roomId, seansId, seansType.name, isAppointment);
}
async function fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId, stripeCustomerId) {
    const batch = database_1.db.batch();
    console.log(purchaseSessionId);
    const purchaseSessionRef = database_1.db.doc(`purchaseSessions/${purchaseSessionId}`);
    batch.update(purchaseSessionRef, { status: "completed" });
    const seansRef = database_1.db.doc(`rooms/${roomId}/seans/${seansId}`);
    batch.update(seansRef, { payment: true });
    const userRef = database_1.db.doc(`users/${userId}`);
    batch.set(userRef, { stripeCustomerId }, { merge: true });
    return batch.commit();
}
async function creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {
    console.log('creatLastSeans initilizwe');
    const dataLastSeans = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
    console.log('dataUser   :', dataLastSeans);
    const therapistRef = database_1.db.doc(`therapists/${uidTherapist}/lastseans/seansLive`);
    therapistRef.set(Object.assign({}, dataLastSeans)).then(() => {
        console.log("therapist seanslive is ok");
    });
    const userRef = database_1.db.doc(`users/${userId}/lastseans/seansLive`);
    userRef.set(Object.assign({}, dataLastSeans)).then(() => {
        console.log("user seanslive is ok");
    });
}
async function creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {
    console.log('creatLastMessageSeans initilizwe');
    const seans = await database_1.getDocData(`rooms/${roomId}/seans/${seansId}`);
    let dataLastSeans = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
    dataLastSeans.question = seans.question;
    const therapistRef = database_1.db.collection(`therapists/${uidTherapist}/lastquestion`);
    therapistRef.add(Object.assign({}, dataLastSeans)).then(() => {
        console.log("therapist message seanslive is ok");
    });
    const userRef = database_1.db.collection(`users/${userId}/lastquestion`);
    userRef.add(Object.assign({}, dataLastSeans)).then(() => {
        console.log("user message seanslive is ok");
    });
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
    };
}
function createAppointment(appointmentData, IdWorkingTime) {
    const appointmentRef = database_1.db.collection('appointment');
    appointmentRef.add(Object.assign({}, appointmentData)).then(() => {
        console.log('added an appointment');
    });
    const workingTimeRef = database_1.db.doc(`workingTime/${IdWorkingTime}`);
    workingTimeRef.update({ reserved: true }).then(() => {
        console.log('added an workingTime');
    });
}
function creatLogSeans(userId, uidTherapist, roomId, seansId, seansType, isAppointment) {
    const logSeansRef = database_1.db.collection('logSeans');
    const createdAt = Date.now();
    logSeansRef.add({ uidTherapist, userId, roomId, seansId, seansType, createdAt, isAppointment });
}
//# sourceMappingURL=stripe-webhooks.route.js.map