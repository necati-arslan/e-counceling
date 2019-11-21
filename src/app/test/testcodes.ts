// getTherapistOfUser(rooms$: Observable<any>) {
//     let allInfo;
//     let joinKeys = {};
//     return rooms$.pipe(
//       switchMap(rooms => {
//         allInfo = rooms;
//         const therapists = rooms.map(room => {
//           let uid = room.uidtherapist
//           if (uid) return this.afs.doc(`users/${uid}`).valueChanges();
//           return '';
//         }).filter(x => x != '');
//         console.log(therapists);
//         return therapists.length ? combineLatest(therapists) : of([]);
//       }),
//       map(
//         (arr: any) => {

//           arr.forEach(v => (joinKeys[(<any>v).uid] = v));//match uid with user info

//           const data = allInfo.map(v => {
//             return { ...v, user: joinKeys[v.uidtherapist] };//chat messege redesign
//           });

//           return data;
//         })
//     );


//   }