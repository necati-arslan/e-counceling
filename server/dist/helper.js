"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
async function getSeansType(seansName) {
    let seansTypes = await database_1.db.collection(`seansPrice`).get();
    let seansDoc;
    seansTypes.forEach(snap => {
        seansDoc = snap.data();
    });
    let seansPirce = seansDoc[seansName].price;
    return seansPirce;
}
exports.getSeansType = getSeansType;
async function createOrder(chargeObject, purchaseSession, customer) {
    console.log("createOrder.......");
    const purchaseSessionId = purchaseSession.id;
    console.log(purchaseSessionId);
    const { userId, roomId, seansId, seansType, uidTherapist, isAppointment, appointmentData, IdWorkingTime } = await database_1.getDocData(`purchaseSessions/${purchaseSessionId}`);
    console.log(userId, roomId, seansId, seansType, uidTherapist, isAppointment, appointmentData, IdWorkingTime);
    await fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId, customer);
    const therapist = await database_1.getDocData(`users/${uidTherapist}`);
    const user = await database_1.getDocData(`users/${userId}`);
    console.log('therapist', therapist);
    const { status } = await database_1.getDocData(`purchaseSessions/${purchaseSessionId}`);
    if (status != "completed")
        return;
    let order;
    if (isAppointment) {
        order = createAppointment(appointmentData, IdWorkingTime, seansType);
    }
    else {
        if (seansType.name != "message") {
            order = await creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
        }
        else {
            order = await creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
        }
    }
    creatLogSeans(userId, uidTherapist, roomId, seansId, seansType.name, isAppointment);
    return order;
}
exports.createOrder = createOrder;
async function fulfillCoursePurchase(userId, roomId, seansId, seansType, uidTherapist, purchaseSessionId, customer) {
    const batch = database_1.db.batch();
    console.log(purchaseSessionId);
    const purchaseSessionRef = database_1.db.doc(`purchaseSessions/${purchaseSessionId}`);
    batch.update(purchaseSessionRef, { status: "completed" });
    const seansRef = database_1.db.doc(`rooms/${roomId}/seans/${seansId}`);
    batch.update(seansRef, { payment: true });
    const stripeCustomerId = customer.id;
    const userRef = database_1.db.doc(`users/${userId}`);
    batch.set(userRef, { stripeCustomerId }, { merge: true });
    return batch.commit();
}
async function creatLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {
    console.log('creatLastSeans initilizwe');
    const dataLastSeans = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
    console.log('dataUser   :', dataLastSeans);
    const therapistRef = database_1.db.doc(`therapists/${uidTherapist}/lastseans/seansLive`);
    await therapistRef.set(Object.assign({}, dataLastSeans));
    const userRef = database_1.db.doc(`users/${userId}/lastseans/seansLive`);
    await userRef.set(Object.assign({}, dataLastSeans));
    let order = { url: 'chat', roomId, seansId };
    return order;
}
async function creatLastMessageSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType) {
    console.log('creatLastMessageSeans initilizwe');
    const seans = await database_1.getDocData(`rooms/${roomId}/seans/${seansId}`);
    let dataLastSeans = getDataLastSeans(uidTherapist, therapist, userId, user, roomId, seansId, seansType);
    dataLastSeans.question = seans.question;
    const therapistRef = database_1.db.collection(`therapists/${uidTherapist}/lastquestion`);
    await therapistRef.add(Object.assign({}, dataLastSeans));
    const userRef = database_1.db.collection(`users/${userId}/lastquestion`);
    await userRef.add(Object.assign({}, dataLastSeans));
    let order = { url: 'questiontotherapist' };
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
    };
}
async function createAppointment(appointmentData, IdWorkingTime, seansType) {
    appointmentData.seansType = seansType;
    const appointmentRef = database_1.db.collection('appointment');
    await appointmentRef.add(Object.assign({}, appointmentData));
    const workingTimeRef = database_1.db.doc(`workingTime/${IdWorkingTime}`);
    await workingTimeRef.update({ reserved: true });
    let order = { url: 'appointmentTable' };
    return order;
}
function creatLogSeans(userId, uidTherapist, roomId, seansId, seansType, isAppointment) {
    const logSeansRef = database_1.db.collection('logSeans');
    const createdAt = Date.now();
    logSeansRef.add({ uidTherapist, userId, roomId, seansId, seansType, createdAt, isAppointment });
}
//# sourceMappingURL=helper.js.map