import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private auth = inject(AuthService);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.auth.getToken();
    let authReq = req;

    // Evita agregar token a llamadas públicas o de login
    if (jwtToken && !req.url.includes('/login')) {
      if (this.isTokenExpired(jwtToken)) {
        console.warn('Token expirado. Cerrando sesión.');
        this.auth.cerrarSesion();
        this.notificacion.mostrarError('Tu sesión ha expirado. Inicia sesión nuevamente.');
        this.router.navigate(['/login']);
        return throwError(() => new Error('Token expirado'));
      }

      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${jwtToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/login')) {
          console.warn('Token inválido o usuario inactivo. Cerrando sesión.');
          this.notificacion.mostrarError('Sesión inválida. Por favor inicia sesión nuevamente.');
          this.auth.cerrarSesion();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Verifica si el JWT está expirado localmente
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now;
    } catch {
      return true;
    }
  }
}
