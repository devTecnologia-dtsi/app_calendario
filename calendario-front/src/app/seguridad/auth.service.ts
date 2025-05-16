import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // URL del endpoint de inicio de sesión
  private readonly loginEndpoint = `${environment.apiUrl}usuarioPorCorreo`;

  // Inyección de dependencias
  private msal = inject(MsalService); 
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    // Verifica si el usuario ya está autenticado al cargar la aplicación
    const token = this.getToken();
    if (token) {
      this.msal.instance.setActiveAccount(this.msal.instance.getAllAccounts()[0]);
    }
  }

  private getUsuarioRaw(): any[] {
    const raw = localStorage.getItem('usuario_info');
    return raw ? JSON.parse(raw) : [];
  }


  get activeAccount(): AccountInfo | null {
    return this.msal.instance.getActiveAccount();
  }

  async iniciarSesion(): Promise<void> {
    const result = await firstValueFrom(this.msal.loginPopup());
    if (result?.account) {
      this.msal.instance.setActiveAccount(result.account);
    }
  }

  async cargarPermisosRoles(): Promise<void> {
    const roles = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}rol`));
    localStorage.setItem('permisos_roles', JSON.stringify(roles.data));
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.msal.logoutRedirect({
      postLogoutRedirectUri: `${window.location.origin}/login`
    });

  }

  async validarConBackend(): Promise<boolean> {
    const account = this.activeAccount;
    if (!account) return false;

    try {
      const respuesta: any = await firstValueFrom(
        this.http.post(this.loginEndpoint, { correo: account.username })
      );

      if (respuesta?.token) {
        try {
          localStorage.setItem('jwt_token', respuesta.token);
          localStorage.setItem('usuario_info', JSON.stringify(respuesta.usuario));
        } catch (e) {
          console.error('Error guardando en localStorage:', e);
          return false;
        }
        return true;
      } else {
        alert('Tu cuenta no está registrada en la base de datos.');
        this.cerrarSesion();
        return false;
      }
    } catch (error) {
      console.error('Error al validar con backend:', error);
      this.cerrarSesion();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getUsuarioInfo(): any {
    const raw = localStorage.getItem('usuario_info');
    return raw ? JSON.parse(raw) : null;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  tieneRol(rol: number): boolean {
    return this.getRoles().includes(rol);
  }

  getRoles(): number[] {
    return [...new Set(this.getUsuarioRaw().map((u) => u.id_rol))];
  }

  getIdUsuario(): number | null {
    const raw = localStorage.getItem('usuario_info');
    const permisos = raw ? JSON.parse(raw) : [];
    return permisos.length ? permisos[0].id : null;
  }

  getSedesUnicas(): number[] {
    const usuario = JSON.parse(localStorage.getItem('usuario_info') || '[]') as { id_sede: number }[];
    return [...new Set(usuario.map((p: any) => p.id_sede))];
  }

  getRectoriasUnicas(): number[] {
    const usuario = JSON.parse(localStorage.getItem('usuario_info') || '[]') as { id_rectoria: number }[];
    return [...new Set(usuario.map((p: any) => p.id_rectoria))];
  }

  tienePermisoPara(tipo: 'academico' | 'financiero' | 'grados', permiso: 'crear' | 'leer' | 'actualizar' | 'borrar'): boolean {
    const rolesUsuario = this.getRoles(); // viene del token (id_rol[])
    const permisos = JSON.parse(localStorage.getItem('permisos_roles') || '[]');

    // Mapeo de tipo calendario a nombre del rol
    const rolEsperado: Record<string, string> = {
      academico: 'academicos',
      financiero: 'financiero',
      grados: 'grados'
    };

    return permisos.some((p: { id: number; nombre: string; [key: string]: any }) =>
      rolesUsuario.includes(p.id) &&
      p.nombre === rolEsperado[tipo] &&
      p[permiso] === 1
    );
  }

  validarSesionPeriodicamente(): void {
    setInterval(async () => {
      const token = this.getToken();
      if (!token) return;

      try {
        const cuenta = this.activeAccount;
        if (!cuenta) throw new Error('Sin cuenta activa');

        const respuesta: any = await firstValueFrom(
          this.http.post(`${this.loginEndpoint}`, { correo: cuenta.username })
        );

        if (!respuesta || !respuesta.token || !respuesta.usuario) {
          console.warn('Sesión inválida detectada. Cerrando sesión.');
          this.cerrarSesion();
        }

        localStorage.setItem('usuario_info', JSON.stringify(respuesta.usuario));
        localStorage.setItem('jwt_token', respuesta.token); // Opcional si cambia

      } catch (error) {
        console.error('Error al validar sesión periódica:', error);
        this.cerrarSesion();
      }
    }, 20 * 60 * 1000); // Cada 20 minutos
  }

}
