import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';

// Interfaces 
export interface Usuario {
  id: number;
  id_rol: number;
  id_sede: number;
  id_rectoria: number;
  correo: string;
  nombre: string;
  [key: string]: any;
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
  usuario?: Usuario[];
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
        this.guardarLS('jwt_token', respuesta.token);
        this.guardarLS('usuario_info', respuesta.usuario);
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
    this.limpiarLS();

    // detener intervalos/timers
    if (this.validacionInterval) {
      clearInterval(this.validacionInterval);
      this.validacionInterval = null;
    }

    if (this.inactividadTimer) {
      clearTimeout(this.inactividadTimer);
      this.inactividadTimer = null;
    }

    // quitar listeners de actividad
    this.eventosActividad.forEach(evento => {
      window.removeEventListener(evento, this.activityHandler);
    });

    // cerrar sesión en MSAL
    this.msal.logoutRedirect({
      postLogoutRedirectUri: `${window.location.origin}/login`
    });
  }

  // Roles y permisos  
  async cargarPermisosRoles(): Promise<void> {
    const roles = await firstValueFrom(this.http.get<{ data: Rol[] }>(`${environment.apiUrl}rol`));
    this.guardarLS('permisos_roles', roles.data);
  }

  tieneRol(rol: number): boolean {
    return this.getRoles().includes(rol);
  }

  getRoles(): number[] {
    return [...new Set(this.getUsuarioInfo().map(u => u.id_rol))];
  }

  tienePermisoPara(
    tipo: 'academico' | 'financiero' | 'grados',
    permiso: 'crear' | 'leer' | 'actualizar' | 'borrar'
  ): boolean {
    const rolesUsuario = this.getRoles();
    const permisos = this.obtenerLS<Rol[]>('permisos_roles', []);

    const rolEsperado: Record<string, string> = {
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

  // Usuario  
  getToken(): string | null {
    return this.obtenerLS<string | null>('jwt_token', null);
  }

  getUsuarioInfo(): Usuario[] {
    return this.obtenerLS<Usuario[]>('usuario_info', []);
  }

  getIdUsuario(): number | null {
    const usuarios = this.getUsuarioInfo();
    return usuarios.length ? usuarios[0].id : null;
  }

  getSedesUnicas(): number[] {
    return [...new Set(this.getUsuarioInfo().map(u => u.id_sede))];
  }

  getRectoriasUnicas(): number[] {
    return [...new Set(this.getUsuarioInfo().map(u => u.id_rectoria))];
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
    }, 10 * 60 * 1000); // 10 minutos
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
    
  // Propiedades 
  private detectandoInactividad = false;
  private lastActivity = Date.now();
  private inactivityTimeoutMs = 5 * 60 * 1000; // 5 minutos
  private checkIntervalMs = 10 * 1000; // comprobación cada 10s
  private checkIntervalRef: any = null;

  // eventos que actualizan actividad
  private activityEvents = [
    'mousemove', 'mousedown', 'keydown', 'scroll',
    'touchstart', 'touchmove', 'pointermove', 'wheel', 'click'
  ];

  private readonly listenerOptions: AddEventListenerOptions = { passive: true };

  private activityHandler = (): void => {
    this.lastActivity = Date.now();
  };

  // handler para visibility change
  private visibilityHandler = (): void => {
    if (!document.hidden) {
      // al volver a la pestaña revisamos si ya pasó el timeout
      const elapsed = Date.now() - this.lastActivity;
      if (elapsed > this.inactivityTimeoutMs) {
        this.notificacionService.mostrarError('Sesión cerrada por inactividad.');
        this.cerrarSesion();
      } else {
        // si no ha pasado, actualizamos lastActivity para evitar logout inmediato
        this.lastActivity = Date.now();
      }
    } else {
      // Al ocultar la pestaña registrar la marca de tiempo
      // this.hiddenAt = Date.now();
    }
  };

  // --- iniciar detección ---
  iniciarDeteccionInactividad(timeoutMs?: number, checkIntervalMs?: number): void {
    if (this.detectandoInactividad) return; // evita registros duplicados
    if (timeoutMs) this.inactivityTimeoutMs = timeoutMs;
    if (checkIntervalMs) this.checkIntervalMs = checkIntervalMs;

    this.detectandoInactividad = true;
    this.lastActivity = Date.now();

    // registrar listeners de actividad
    this.activityEvents.forEach(evt => {
      document.addEventListener(evt, this.activityHandler, this.listenerOptions);
    });

    // evento visibilidad
    document.addEventListener('visibilitychange', this.visibilityHandler);

    // comprobación periódica
    this.checkIntervalRef = setInterval(() => {
      if (Date.now() - this.lastActivity > this.inactivityTimeoutMs) {
        this.notificacionService.mostrarError('Sesión cerrada por inactividad.');
        this.cerrarSesion();
      }
    }, this.checkIntervalMs);
  }

  // --- detener detección ---
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

  // Métodos  
  esAdmin(): boolean {
    return this.getRoles().includes(1); // id_rol = 1 es admin
  }

  getEmailUsuario(): string | null {
    return this.activeAccount?.username ?? null;
  }
  
}
