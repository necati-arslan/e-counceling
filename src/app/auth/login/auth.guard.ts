import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take, first } from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private afauth: AngularFireAuth) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        return this.afauth.authState.pipe(
            take(1),
            map(user => {
                if (user && user.uid) return true;
                this.router.navigate(['']);
                return false;
            })

        );



    }

} 