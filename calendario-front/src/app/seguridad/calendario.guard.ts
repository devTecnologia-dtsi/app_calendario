import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CalendarioGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const tipo = route.paramMap.get('tipo') as 'academico' | 'financiero' | 'grados';

    if (this.auth.tienePermisoPara(tipo, 'crear')) {
      return true;
    }

    // Redirigir si no tiene permisos
    this.router.navigate(['/dashboard']);
    return false;
  }
}
