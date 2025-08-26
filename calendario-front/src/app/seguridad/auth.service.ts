import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // URL del endpoint de inicio de sesión
  private readonly loginEndpoint = `${environment.apiUrl}usuarioPorCorreo`;

  // Inyección de dependencias
  private msal = inject(MsalService); 
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificacionService = inject(NotificacionService);

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

      // Iniciar detección de inactividad
      this.iniciarDeteccionInactividad();
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
          // console.error('Error guardando en localStorage:', e);
          return false;
        }
        return true;
      } else {
        alert('Tu cuenta no está registrada en la base de datos.');
        this.cerrarSesion();
        return false;
      }
    } catch (error) {
      // console.error('Error al validar con backend:', error);
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
    let fallosConsecutivos = 0;

    setInterval(async () => {
      const token = this.getToken();
      if (!token) return;

      try {
        const cuenta = this.activeAccount;
        if (!cuenta) throw new Error('Sin cuenta activa');

        const respuesta: any = await firstValueFrom(
          this.http.post(`${this.loginEndpoint}`, { correo: cuenta.username })
        );

        if (!respuesta?.token || !respuesta?.usuario) {
          fallosConsecutivos++;
          if (fallosConsecutivos >= 3) { // solo cerrar si falla 3 veces seguidas
            this.notificacionService.mostrarError('Sesión inválida. Por favor, inicia sesión nuevamente.');
            this.cerrarSesion();
          }
          return;
        }

        // resetear contador si salió bien
        fallosConsecutivos = 0;

        localStorage.setItem('usuario_info', JSON.stringify(respuesta.usuario));
        localStorage.setItem('jwt_token', respuesta.token);

      } catch (error) {
        console.error('Error validando sesión periódica:', error);
        fallosConsecutivos++;
        if (fallosConsecutivos >= 3) {
          this.cerrarSesion();
        }
      }
    }, 10 * 60 * 1000); // Cada 10 minutos
  }

  async refrescarPermisosSiEsNecesario(): Promise<void> {
    const ultimaCarga = Number(localStorage.getItem('ultima_carga_permisos') || 0);
    const ahora = Date.now();

    // Solo recargar si pasaron más de 10 minutos
    if (ahora - ultimaCarga > 10 * 60 * 1000) {
      try {
        const roles = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}rol`));
        localStorage.setItem('permisos_roles', JSON.stringify(roles.data));
        localStorage.setItem('ultima_carga_permisos', ahora.toString());
      } catch (err) {
        console.error('Error refrescando permisos:', err);
      }
    }
  }

  private inactividadTimer: any;

  iniciarDeteccionInactividad(): void {
    const limiteInactividad = 2 * 60 * 1000; // 2 minutos

    const reiniciarTimer = () => {
      if (this.inactividadTimer) clearTimeout(this.inactividadTimer);
      this.inactividadTimer = setTimeout(() => {
        this.notificacionService.mostrarError('Sesión cerrada por inactividad.');
        this.cerrarSesion();
      }, limiteInactividad);
    };

    // Detectar actividad del usuario
    ['mousemove', 'keydown', 'click'].forEach(evento => {
      window.addEventListener(evento, reiniciarTimer);
    });

    reiniciarTimer(); // inicia el contador apenas entra
  }

  // Obteniendo datos del usuario desde MSAL
  getNombreUsuario(): string | null {
    return this.activeAccount?.name || null;
  }

  getEmailUsuario(): string | null {
    return this.activeAccount?.username || null;
  }

  async getFotoUsuario(): Promise<string | null> {
    const token = await this.msal.instance.acquireTokenSilent({
      scopes: ["User.Read"]
    });

    if (!token) return null;

    try {
      const fotoBlob = await firstValueFrom(
        this.http.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: { Authorization: `Bearer ${token.accessToken}` },
          responseType: 'blob'
        })
      );

      return URL.createObjectURL(fotoBlob);
    } catch (error) {
      console.error('Error obteniendo foto de usuario:', error);
      return null;
    }
  }

}
