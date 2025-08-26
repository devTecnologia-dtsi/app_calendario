import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  private notificacionService = inject(NotificacionService);

  canActivate(): boolean {
    if (this.auth.estaAutenticado()) {
      return true;
    }
    // Redirigir al login si no está autenticado
    this.notificacionService.mostrarError('Por favor, inicia sesión para continuar');
    this.router.navigate(['/login']);

    
    return false;
  }
}