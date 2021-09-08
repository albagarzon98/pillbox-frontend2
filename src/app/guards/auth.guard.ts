import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, CanActivateChild, Route, UrlSegment, CanDeactivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  
  constructor( private auth: AuthService,
               private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url:any): boolean {
    if ( this.auth.isAuthenticated() ) {
      const userRole = this.auth.getRole();
      console.log(`Valor del rol en el guard: ${this.auth.getRole()}`);
      if ( route.data.role && route.data.role.indexOf(userRole) === -1 ) {
        this.navigateByRole(userRole);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  navigateByRole ( role:string ) {
    if ( role === 'admin') {
      this.router.navigateByUrl('/homeAdmin');
    }
    if ( role === 'tutor') {
      this.router.navigateByUrl('/homeTutor');
    }
    if ( role === 'farmaceutico') {
      this.router.navigateByUrl('/homePharmacist');
    }
    if ( role === 'paciente') {
      this.router.navigateByUrl('/home');
    }
  }
}
