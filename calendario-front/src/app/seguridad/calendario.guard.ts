import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CalendarioGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const tipo = route.paramMap.get('tipo') as 'admin' | 'academico' | 'financiero' | 'grados';

    // console.log('CalendarioGuard - Verificando acceso para tipo:', tipo);

    // Si es admin, permitir siempre (independientemente del tipo)
    if (this.auth.tienePermisoPara('admin', 'crear')) {
      // console.log('CalendarioGuard - Usuario es ADMIN, acceso permitido');
      return true;
    }

    // Si no es admin, verificar el permiso específico del tipo
    if (this.auth.tienePermisoPara(tipo, 'crear')) {
      // console.log(`CalendarioGuard - Usuario tiene permiso para ${tipo}`);
      return true;
    }

    // No tiene permisos, redirigir al dashboard
    console.error('CalendarioGuard - Acceso DENEGADO para tipo:', tipo);
    this.router.navigate(['/dashboard']);
    return false;
  }
}