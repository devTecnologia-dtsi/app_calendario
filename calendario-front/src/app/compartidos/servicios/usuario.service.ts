import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioCreacionDTO, UsuarioDTO } from '../../usuarios/usuario';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + '/usuario';

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

  // insertarUsuario(usuario: UsuarioCreacionDTO): Observable<UsuarioCreacionDTO> {
  //   return this.http.post<UsuarioCreacionDTO>(this.urlBase, usuario).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  crearUsuario(usuario: UsuarioCreacionDTO) {
    return this.http.post(this.urlBase, usuario).pipe(catchError(this.handleError));
  }

  // actualizarUsuario(id: number, usuario: UsuarioCreacionDTO): Observable<UsuarioCreacionDTO> {
  //   return this.http.put<UsuarioCreacionDTO>(`${this.urlBase}/${id}`, usuario).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  actualizarUsuario(id: number, usuario: UsuarioCreacionDTO) {
    return this.http.put(`${this.urlBase}/${id}`, usuario).pipe(catchError(this.handleError));
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Se produjo un error', error);
    return throwError('Ha ocurrido un error, por favor inténtelo más tarde.');
  }
}


