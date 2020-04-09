import * as functions from 'firebase-functions';
import { firestore } from './init';

export const finishSeans = functions.firestore
    .document('rooms/{roomId}/seans/{seansId}')
    .onUpdate((change, context) => {
        const changeData: any = change.after.data();
        const beforeData: any = change.before.data();

        console.log('changeData =>', changeData);
        console.log('change.after.ref =>', change.after.ref);
        console.log('beforeData=>', beforeData);
        console.log('beforeData startedTime =>', beforeData.startedTime);
        console.log('context=>', context);

        //const uid = context.params.userId
        const beforeStartedTime = beforeData.startedTime;
        const afterStartedTime = changeData.startedTime;

        const roomId = context.params.roomId;
        const seansId = context.params.seansId
        if (!beforeStartedTime && afterStartedTime) {

            const time = 1000;
            console.log('initilezing finishTime......');
            const finishedTime = afterStartedTime + (1000 * 60 * 60);
            const data = {
                finishedTime,
                state: 'finished'
            }
            const docRef = firestore.doc(`rooms/${roomId}/seans/${seansId}`);
            docRef.get().then((x: any) => {
                console.log('>>>>>>>>>>>>')
                console.log('firestore', x);
                let seansRef = firestore.doc(x.ref.path);
                seansRef.update({ ...data })

            })

            setTimeout(() => {//settimeout ücretli firebasede-uzunsüreleri desteklemiyor
                console.log('created finishTime......');
                console.log('roomId=>', roomId);
                console.log('seansId=>', seansId);
            }, time);

        }
        return 0;//return etmek lazım
    })