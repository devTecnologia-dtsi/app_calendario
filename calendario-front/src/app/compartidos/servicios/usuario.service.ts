import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RespuestaAPI, UsuarioCreacionDTO, UsuarioDTO } from '../../usuarios/usuario';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + 'usuario';

  listarUsuarios(limite: number, offset: number, filtro: string = ''): Observable<RespuestaAPI> {
    const url = `${this.urlBase}/?limite=${limite}&offset=${offset}&filtro=${encodeURIComponent(filtro)}`;
    return this.http.get<RespuestaAPI>(url).pipe(catchError(this.handleError));
  }
  
  consultarUsuario(id: number): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}/${id}`).pipe(catchError(this.handleError));
  }

  crearUsuario(usuario: UsuarioCreacionDTO): Observable<RespuestaAPI> {
    return this.http.post<RespuestaAPI>(this.urlBase, usuario).pipe(catchError(this.handleError));
  }

  actualizarUsuario(id: number, usuario: UsuarioCreacionDTO): Observable<RespuestaAPI> {
    return this.http.put<RespuestaAPI>(`${this.urlBase}/${id}`, usuario).pipe(catchError(this.handleError));
  }

  desactivarUsuario(id: number): Observable<RespuestaAPI> {
    return this.http.patch<RespuestaAPI>(`${this.urlBase}/${id}`, {}).pipe(catchError(this.handleError));
  }
  
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
