import * as functions from 'firebase-functions';
import { firestore } from './init';

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environme

export const useWildcard = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
        const changeData: any = change.after.data();
        const beforeData:any=change.before.data();
        const uid = context.params.userId

        if(changeData.displayName!=beforeData.displayName){ 
            
        let collectionRef = firestore.collection('rooms')
        collectionRef.where('therapist.uidtherapist', '==', uid).get()
        .then((querySnapshot: any) => {
            querySnapshot.forEach((documentSnapshot: any) => {
                console.log(`Found document at ${documentSnapshot.ref.path}`);
                let roomRef = firestore.doc(documentSnapshot.ref.path);
                let data = {
                    therapist: {
                        therapistname: changeData.displayName,
                        uidtherapist: uid
                    }
                }
                roomRef.update({ ...data }); 
            });
        });
    }
    });