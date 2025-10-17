import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';

// Interfaces
export interface Permiso {
  id_rectoria: number;
  nombre_rectoria: string;
  id_sede: number;
  nombre_sede: string;
  id_rol: number;
  nombre_rol: string;
}

export interface Usuario {
  id: number;
  correo: string;
  permisos: Permiso[];
}

export interface Rol {
  id: number;
  nombre: string;
  crear?: number;
  leer?: number;
  actualizar?: number;
  borrar?: number;
}

export interface RespuestaAuth {
  status: number;
  token?: string;
  usuario?: Usuario;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginEndpoint = `${environment.apiUrl}usuarioPorCorreo`;

  private msal = inject(MsalService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificacionService = inject(NotificacionService);

  private inactividadTimer: any;
  private validacionInterval: any;
  private eventosActividad: string[] = ['mousemove', 'keydown', 'click'];

  constructor() {
    const token = this.getToken();
    if (token) {
      this.msal.instance.setActiveAccount(this.msal.instance.getAllAccounts()[0]);
      this.iniciarDeteccionInactividad();
    }
  }

  // LocalStorage
  private guardarLS(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error guardando ${key} en localStorage:`, e);
    }
  }

  private obtenerLS<T>(key: string, defecto: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defecto;
    } catch {
      return defecto;
    }
  }

  private limpiarLS(): void {
    localStorage.clear();
  }

  // Autenticación
  get activeAccount(): AccountInfo | null {
    return this.msal.instance.getActiveAccount();
  }

  async iniciarSesion(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.msal.loginPopup({ scopes: ['User.Read'] })
      );

      if (result?.account) {
        this.msal.instance.setActiveAccount(result.account);
        this.iniciarDeteccionInactividad();
      }
    } catch (error) {
      console.error('Error en loginPopup:', error);
      this.router.navigate(['/login']);
    }
  }

  async validarConBackend(): Promise<boolean> {
    const account = this.activeAccount;
    if (!account) return false;

    try {
      const respuesta = await firstValueFrom(
        this.http.post<RespuestaAuth>(this.loginEndpoint, { correo: account.username })
      );

      if (respuesta?.token && respuesta?.usuario) {
        this.guardarLS('usuario_info', respuesta.usuario);
        this.guardarLS('jwt_token', respuesta.token); 

        this.detenerDeteccionInactividad();
        this.iniciarDeteccionInactividad();
        return true;
      } else {
        this.notificacionService.mostrarError('Tu cuenta no está registrada en la base de datos.');
        this.cerrarSesion();
        return false;
      }
    } catch (error) {
      console.error('Error al validar con backend:', error);
      this.cerrarSesion();
      return false;
    }
  }

  cerrarSesion(): void {
    this.detenerDeteccionInactividad();
    this.limpiarLS();

    if (this.validacionInterval) {
      clearInterval(this.validacionInterval);
      this.validacionInterval = null;
    }

    if (this.inactividadTimer) {
      clearTimeout(this.inactividadTimer);
      this.inactividadTimer = null;
    }

    this.eventosActividad.forEach(evento => {
      window.removeEventListener(evento, this.activityHandler);
    });

    this.msal.logoutRedirect({
      postLogoutRedirectUri: `${window.location.origin}/login`
    });
  }

  // Roles y permisos
  async cargarPermisosRoles(): Promise<void> {
    const roles = await firstValueFrom(this.http.get<{ data: Rol[] }>(`${environment.apiUrl}rol`));
    this.guardarLS('permisos_roles', roles.data);
  }

  tieneRol(idRol: number): boolean {
    return this.getRoles().includes(idRol);
  }

  getRoles(): number[] {
    const usuario = this.getUsuarioInfo();
    if (!usuario) return [];
    return usuario.permisos.map(p => p.id_rol);
  }

  tienePermisoPara(
    tipo: 'admin'| 'academico' | 'financiero' | 'grados',
    permiso: 'crear' | 'leer' | 'actualizar' | 'borrar'
  ): boolean {
    const rolesUsuario = this.getRoles();
    const permisos = this.obtenerLS<Rol[]>('permisos_roles', []);

    const rolEsperado: Record<string, string> = {
      admin: 'admin',
      academico: 'academicos',
      financiero: 'financiero',
      grados: 'grados'
    };

    return permisos.some(p =>
      rolesUsuario.includes(p.id) &&
      p.nombre === rolEsperado[tipo] &&
      p[permiso] === 1
    );
  }

  // Verifica si el usuario tiene permiso para un tipo de calendario específico
  tienePermisoCalendario(
    tipoCalendario: 'admin' | 'academico' | 'financiero' | 'grados',
    idRectoria?: number,
    idSede?: number
  ): boolean {
    const usuario = this.getUsuarioInfo();
    if (!usuario) return false;

    // Mapeo de tipos de calendario a roles permitidos
    const rolesPermitidos: Record<string, string[]> = {
      academico: ['admin', 'academicos'],
      financiero: ['admin', 'financiero'],
      grados: ['admin', 'grados']
    };

    const roles = rolesPermitidos[tipoCalendario] || [];

    return usuario.permisos.some(p => {
      const tieneRol = roles.includes(p.nombre_rol.toLowerCase());
      const coincideRectoria = idRectoria ? p.id_rectoria === idRectoria : true;
      const coincideSede = idSede ? p.id_sede === idSede : true;
      
      return tieneRol && coincideRectoria && coincideSede;
    });
  }

  // Obtiene IDs de rectorías únicas con al menos un permiso del tipo especificado
  getRectoriasConPermiso(tipoCalendario: 'admin' | 'academico' | 'financiero' | 'grados'): number[] {
    const usuario = this.getUsuarioInfo();
    if (!usuario) return [];

    const rolesPermitidos: Record<string, string[]> = {
      academico: ['admin', 'academicos'],
      financiero: ['admin', 'financiero'],
      grados: ['admin', 'grados']
    };

    const roles = rolesPermitidos[tipoCalendario] || [];
    const rectoriasIds = new Set<number>();

    usuario.permisos.forEach(p => {
      if (roles.includes(p.nombre_rol.toLowerCase())) {
        rectoriasIds.add(p.id_rectoria);
      }
    });

    return Array.from(rectoriasIds);
  }

  // Obtiene IDs de sedes con permiso para un tipo de calendario y rectoría específica
  getSedesConPermiso(
    tipoCalendario: 'admin' | 'academico' | 'financiero' | 'grados',
    idRectoria: number
  ): number[] {
    const usuario = this.getUsuarioInfo();
    if (!usuario) return [];

    const rolesPermitidos: Record<string, string[]> = {
      academico: ['admin', 'academicos'],
      financiero: ['admin', 'financiero'],
      grados: ['admin', 'grados']
    };

    const roles = rolesPermitidos[tipoCalendario] || [];
    const sedesIds = new Set<number>();

    usuario.permisos.forEach(p => {
      if (
        roles.includes(p.nombre_rol.toLowerCase()) &&
        p.id_rectoria === idRectoria
      ) {
        sedesIds.add(p.id_sede);
      }
    });

    return Array.from(sedesIds);
  }

  // Obtiene todos los permisos del usuario
  getPermisos(): Permiso[] {
    const usuario = this.getUsuarioInfo();
    return usuario?.permisos ?? [];
  }

  // Usuario
  getToken(): string | null {
    return this.obtenerLS<string | null>('jwt_token', null);
  }

  getUsuarioInfo(): Usuario | null {
    return this.obtenerLS<Usuario | null>('usuario_info', null);
  }

  getIdUsuario(): number | null {
    const usuario = this.getUsuarioInfo();
    return usuario ? usuario.id : null;
  }

  getSedesUnicas(): number[] {
    const usuario = this.getUsuarioInfo();
    if (!usuario) return [];
    return [...new Set(usuario.permisos.map(p => p.id_sede))];
  }

  getRectoriasUnicas(): number[] {
    const usuario = this.getUsuarioInfo();
    if (!usuario) return [];
    return [...new Set(usuario.permisos.map(p => p.id_rectoria))];
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  // Validación periódica
  validarSesionPeriodicamente(): void {
    let fallosConsecutivos = 0;

    this.validacionInterval = setInterval(async () => {
      const token = this.getToken();
      if (!token) return;

      try {
        const cuenta = this.activeAccount;
        if (!cuenta) throw new Error('Sin cuenta activa');

        const respuesta = await firstValueFrom(
          this.http.post<RespuestaAuth>(this.loginEndpoint, { correo: cuenta.username })
        );

        if (!respuesta?.token || !respuesta?.usuario) {
          fallosConsecutivos++;
          if (fallosConsecutivos >= 3) {
            this.notificacionService.mostrarError('Sesión inválida. Inicia sesión nuevamente.');
            this.cerrarSesion();
          }
          return;
        }

        fallosConsecutivos = 0;
        this.guardarLS('usuario_info', respuesta.usuario);
        this.guardarLS('jwt_token', respuesta.token);

      } catch (error) {
        console.error('Error validando sesión periódica:', error);
        fallosConsecutivos++;
        if (fallosConsecutivos >= 3) {
          this.cerrarSesion();
        }
      }
    }, 10 * 60 * 1000); // cada 10 minutos
  }

  // Permisos cacheados
  async refrescarPermisosSiEsNecesario(): Promise<void> {
    const ultimaCarga = Number(localStorage.getItem('ultima_carga_permisos') || 0);
    const ahora = Date.now();

    if (ahora - ultimaCarga > 10 * 60 * 1000) {
      try {
        const roles = await firstValueFrom(this.http.get<{ data: Rol[] }>(`${environment.apiUrl}rol`));
        this.guardarLS('permisos_roles', roles.data);
        localStorage.setItem('ultima_carga_permisos', ahora.toString());
      } catch (err) {
        console.error('Error refrescando permisos:', err);
      }
    }
  }

  // Inactividad
  private detectandoInactividad = false;
  private lastActivity = Date.now();
  private inactivityTimeoutMs = 5 * 60 * 1000; // 5 min
  private checkIntervalMs = 10 * 1000; // 10 seg
  private checkIntervalRef: any = null;

  private activityEvents = [
    'click',
    'mousemove',
    'keydown',
    'mousedown',
    'touchstart'
  ];

  private readonly listenerOptions: AddEventListenerOptions = { passive: true };

  private activityHandler = (): void => {
    this.lastActivity = Date.now();
  };

  private visibilityHandler = (): void => {
    if (!document.hidden) {
      const elapsed = Date.now() - this.lastActivity;
      if (elapsed > this.inactivityTimeoutMs) {
        this.notificacionService.mostrarError('Sesión cerrada por inactividad.');
        this.cerrarSesion();
      }
    }
  };

  iniciarDeteccionInactividad(timeoutMs?: number, checkIntervalMs?: number): void {
    if (this.detectandoInactividad) return;
    if (timeoutMs) this.inactivityTimeoutMs = timeoutMs;
    if (checkIntervalMs) this.checkIntervalMs = checkIntervalMs;

    this.detectandoInactividad = true;
    this.lastActivity = Date.now();

    this.activityEvents.forEach(evt => {
      document.addEventListener(evt, this.activityHandler, this.listenerOptions);
    });

    document.addEventListener('visibilitychange', this.visibilityHandler);

    this.checkIntervalRef = setInterval(() => {
      if (Date.now() - this.lastActivity > this.inactivityTimeoutMs) {
        this.notificacionService.mostrarError('Sesión cerrada por inactividad.');
        this.cerrarSesion();
      }
    }, this.checkIntervalMs);
  }

  detenerDeteccionInactividad(): void {
    if (!this.detectandoInactividad) return;

    this.activityEvents.forEach(evt => {
      document.removeEventListener(evt, this.activityHandler, this.listenerOptions);
    });

    document.removeEventListener('visibilitychange', this.visibilityHandler);

    if (this.checkIntervalRef) {
      clearInterval(this.checkIntervalRef);
      this.checkIntervalRef = null;
    }

    this.detectandoInactividad = false;
  }

  // Métodos auxiliares
  esAdmin(): boolean {
    return this.getRoles().includes(1);
  }

  getEmailUsuario(): string | null {
    return this.activeAccount?.username ?? null;
  }
}