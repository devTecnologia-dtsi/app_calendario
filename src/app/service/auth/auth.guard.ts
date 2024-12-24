import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccesoUsuarioService } from './acceso-service';
import { Observable, firstValueFrom } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard {
  public rolUsuario$: Observable<boolean> = new Observable<boolean>();

  constructor(
    private msalService: MsalService,
    private router: Router,
    private aus: AccesoUsuarioService,
    private loadingService: LoadingService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
  
    if (this.msalService.instance.getAllAccounts().length > 0) {
      let correo = this.msalService.instance.getAllAccounts()[0].username;
      const accion = 'verificar_rol'; // Acción a enviar a Digibee
  
      const token = localStorage.getItem('token');
  
      if (token) {
        return true;
      } else {
        try {
          this.loadingService.show();
          // Llamada a Digibee para obtener el rol del usuario pasando correo y acción
          const response = await firstValueFrom(this.aus.accesoUsuario(correo, accion));
  
          if (!response.resp) {
            this.loadingService.hide();
            this.router.navigate(['/login'], { queryParams: { messageError: response.message } });
            return false;
          } else {
            const role = response.data.rol;  // Recibe el rol desde Digibee
  
            // Almacenar el token si es necesario
            localStorage.setItem('token', response.data.token);
  
            this.loadingService.hide();
  
            // Redireccionar según el rol del usuario
            if (role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (role === 'user') {
              this.router.navigate(['/user']);
            } else {
              this.router.navigate(['/login']);
              return false;
            }
  
            return true;
          }
        } catch (error: any) {
          this.loadingService.hide();
          this.router.navigate(['/login'], { queryParams: { messageError: error } });
          return false;
        }
      }
    } else {
      return false;
    }
  }  
}
