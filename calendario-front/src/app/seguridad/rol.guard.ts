import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';

@Injectable({ providedIn: 'root' })
export class RolGuard implements CanActivate {
  
  // Inyección de dependencias
  private notificacionService = inject(NotificacionService);
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const rolesPermitidos = [1]; // solo admins
    const tienePermiso = this.auth.getRoles().some(r => rolesPermitidos.includes(r));

    if (!tienePermiso) {
      this.notificacionService.mostrarError('No tienes permiso para acceder a esta sección');
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
