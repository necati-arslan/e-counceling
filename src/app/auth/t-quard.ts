import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take, first } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({providedIn: "root"})

export class TGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private afauth: AngularFireAuth) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      return this.authService.user$.pipe(
            map(user=>{
                if (user && user.type=='therapist') return true;
                this.router.navigate(['/'])
                return false;
            })    
        );        


    }

} 