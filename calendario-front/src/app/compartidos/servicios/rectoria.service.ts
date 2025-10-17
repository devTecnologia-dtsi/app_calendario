import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../seguridad/auth.service';

// Interfaces
export interface Rectoria {
  id_rectoria: number;
  nombre_rectoria: string;
}

export interface RespuestaAPI {
  status: number;
  message: string;
  data: Rectoria[];
}

@Injectable({ providedIn: 'root' })
export class RectoriaService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private urlBase = environment.apiUrl;

  // Lista TODAS las rectorías (solo para admin)
  listarRectorias(): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}rectoria`).pipe(
      catchError(this.handleError)
    );
  }

  // Lista las rectorías filtradas por usuario autenticado
  listarRectoriasPorUsuario(tipo: 'admin' |'academico' | 'financiero' | 'grados'): Observable<RespuestaAPI> {
    const params = tipo ? `?rol=${tipo}` : '';
    // console.log('URL de solicitud:', `${this.urlBase}rectoriasPorUsuario${params}`);

    return this.http
      .get<RespuestaAPI>(`${this.urlBase}rectoriasPorUsuario${params}`)
      .pipe(catchError(this.handleError));
  }

  // Detecta automáticamente qué tipo de rol tiene el usuario (academico, financiero o grados)
  private detectarTipoCalendarioActual(): string | null {
    const usuario = this.auth.getUsuarioInfo();
    if (!usuario) {
      console.warn('No se encontró información de usuario');
      return null;
    }

    const roles = usuario.permisos.map(p => p.nombre_rol.toLowerCase());
    // console.log('Roles encontrados en el token:', roles);

    if (roles.includes('admin')) return 'admin';
    if (roles.includes('academicos')) return 'academico';
    if (roles.includes('financiero')) return 'financiero';
    if (roles.includes('grados')) return 'grados';

    console.warn('No se detectó ningún rol conocido');
    return null;
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
    }
    console.error('Error HTTP:', error);
    return throwError(() => new Error(errorMessage));
  }
}
