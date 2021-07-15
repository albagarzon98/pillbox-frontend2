import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    let request = req;
    
    if (token) {      
      request = req.clone({
        headers
      });
    }

    return next.handle( request ).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this. router.navigateByUrl('/login');
          this.auth.logout();
        }

        return throwError( err );
      })
    );
  }

}
