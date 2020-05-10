import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take, first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({providedIn: "root"})

export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private afauth: AngularFireAuth) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {

      return this.authService.userSubject$.pipe(
            map((user:any)=>{
                if (user && user.role=='userOfManager') return true;
                this.router.navigate(['/'])
                return false;
            })    
        );        
    }

} 