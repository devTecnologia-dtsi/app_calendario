import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PermisoUsuario, UsuarioDTO, UsuarioCreacionDTO, RespuestaAPI} from '../../usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}usuario`;
  private basePermiso = `${environment.apiUrl}permiso`;

  // Listar usuarios
  listarUsuarios(limite: number, offset: number, filtro: string = ''): Observable<RespuestaAPI> {
    const params = new URLSearchParams({
      limite: limite.toString(),
      offset: offset.toString(),
      filtro
    });
    const url = `${this.urlBase}/?${params.toString()}`;
    return this.http.get<RespuestaAPI>(url).pipe(catchError(this.handleError));
  }

  // Consultar un usuario por ID
  consultarUsuario(id: number): Observable<{
    status: number;
    message: string;
    data: { usuario: UsuarioDTO; permisos: UsuarioDTO['permisos'] };
  }> {
    return this.http.get<any>(`${this.urlBase}/${id}`).pipe(
      map((resp) => {
        // Normalizamos la respuesta por si el backend cambia algo en el formato
        if (resp.status === 1 && resp.data?.usuario) {
          return {
            status: resp.status,
            message: resp.message,
            data: {
              usuario: resp.data.usuario,
              permisos: resp.data.permisos ?? []
            }
          };
        }
        return resp;
      }),
      catchError(this.handleError)
    );
  }

  // Crear un nuevo usuario (usa sp_usuario_crud → 'insertar')
  crearUsuario(usuario: UsuarioCreacionDTO): Observable<RespuestaAPI> {
    return this.http.post<RespuestaAPI>(this.urlBase, usuario).pipe(catchError(this.handleError));
  }

  // Actualizar usuario existente (usa sp_usuario_crud → 'actualizar')
  actualizarUsuario(id: number, usuario: UsuarioCreacionDTO): Observable<RespuestaAPI> {
    // console.log('PUT → URL:', `${this.urlBase}/${id}`);
    // console.log('Datos enviados al backend:', JSON.stringify(usuario, null, 2));
    return this.http.put<RespuestaAPI>(`${this.urlBase}/${id}`, usuario).pipe(catchError(this.handleError));
  }

  // Desactivar usuario (usa sp_usuario_crud → 'desactivar')
  desactivarUsuario(id: number): Observable<RespuestaAPI> {
    return this.http.patch<RespuestaAPI>(`${this.urlBase}/${id}`, {}).pipe(catchError(this.handleError));
  }

  desactivarPermiso(id: number): Observable<RespuestaAPI> {
    return this.http.patch<RespuestaAPI>(`${this.basePermiso}/${id}`, {}).pipe(catchError(this.handleError));
  }

  // Listar permisos del usuario
  listarPermisosUsuario(idUsuario: number): Observable<RespuestaAPI> {
    const url = `${this.urlBase}/${idUsuario}/permisos`;
    return this.http.get<RespuestaAPI>(url).pipe(catchError(this.handleError));
  }

  // Agregar permiso
  agregarPermisoUsuario(idUsuario: number, idRectoria: number, idSede: number, idRol: number): Observable<RespuestaAPI> {
    const body = { id_usuario: idUsuario, id_rectoria: idRectoria, id_sede: idSede, id_rol: idRol };
    const url = `${this.urlBase}/${idUsuario}/permisos`;
    return this.http.post<RespuestaAPI>(url, body).pipe(catchError(this.handleError));
  }

  // Eliminar permiso
  eliminarPermisoUsuario(idUsuario: number, idRectoria: number, idSede: number, idRol: number): Observable<RespuestaAPI> {
    const params = new URLSearchParams({
      id_rectoria: idRectoria.toString(),
      id_sede: idSede.toString(),
      id_rol: idRol.toString()
    });
    const url = `${this.urlBase}/${idUsuario}/permisos?${params.toString()}`;
    return this.http.delete<RespuestaAPI>(url).pipe(catchError(this.handleError));
  }

  // Manejo de errores global
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Error del servidor (${error.status}): ${error.error?.message || error.message}`;
    }
    console.error('Error HTTP:', error);
    return throwError(() => new Error(errorMessage));
  }
}
