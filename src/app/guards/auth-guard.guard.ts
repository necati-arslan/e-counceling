import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,private router:Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.userSubject$.pipe(
      map((user: any) => {
        if (user.uid) {
          return true;
        } else {
          this.router.navigate(['/'])
          return false;
        }

      }));

  }

} 
