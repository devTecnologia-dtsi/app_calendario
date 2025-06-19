import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.auth.getToken();
    let authReq = req;

    if (jwtToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${jwtToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('Token inválido o usuario inactivo. Cerrando sesión.');
          this.auth.cerrarSesion();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
