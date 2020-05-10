import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take, first, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { RoomService } from '../services/room.service';


@Injectable({ providedIn: "root" })

export class SeansGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private roomService: RoomService,
        private router: Router,
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const roomId = route.paramMap.get('roomId');
        console.log(roomId);

        let user: any;


        return this.authService.userSubject$.pipe(
            switchMap(userInfo => {
                user = userInfo;
                return this.roomService.getRoomById(roomId)
            }),
            map((room: any) => {
                console.log(room, user);
                let uidTherapist = room.uidtherapist;
                let uidUser = room.uiduser;
                if (uidUser == user.uid || uidTherapist == user.uid) {
                    return true;
                } else {
                    this.router.navigate(['/'])
                    return false;
                }
            }
            )
        );


    }

} 