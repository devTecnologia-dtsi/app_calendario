import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// export const rolGuard: CanActivateFn = (rolesPermitidos: number[]) => {
export const rolGuard = (rolesPermitidos: number[]) => {
  return (): boolean => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const usuario = auth.getUsuarioInfo();

    if (usuario?.id_rol && rolesPermitidos.includes(usuario.id_rol)) {
      return true;
    }

    // Si no tiene permiso, redirigir
    router.navigate(['/no-autorizado']);
    return false;
  };
};
