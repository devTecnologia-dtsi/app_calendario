import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RespuestaAPI, UsuarioCreacionDTO, UsuarioDTO } from '../../usuarios/usuario';
import { environment } from '../../../environments/environment.development';
import { extraerErrores } from '../funciones/extraerErrores';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + 'usuario';

  listarUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.urlBase}/`).pipe(
      catchError(this.handleError)
    );
  }

  consultarUsuario(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.urlBase}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  crearUsuario(usuario: UsuarioCreacionDTO) {
    return this.http.post(this.urlBase, usuario).pipe(catchError(this.handleError));
  }

  actualizarUsuario(id: number, usuario: UsuarioCreacionDTO) {
    return this.http.put(`${this.urlBase}/${id}`, usuario).pipe(catchError(this.handleError));
  }

  desactivarUsuario(id: number): Observable<RespuestaAPI> {
    return this.http.patch<RespuestaAPI>(`${this.urlBase}/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // private handleError(error: any) {
  //   console.error('Se produjo un error', error);
  //   return throwError('Ha ocurrido un error, por favor inténtelo más tarde.');
  // }

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


