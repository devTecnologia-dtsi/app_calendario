import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RolDTO, RolCreacionDTO, RespuestaAPIRol } from '../../rol/rol';
// import { environment } from '../../../environments/environment.development';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}rol/`;

  // Listar todos los roles
  listarRoles(): Observable<RespuestaAPIRol> {
    return this.http.get<RespuestaAPIRol>(this.urlBase).pipe(
      catchError(this.handleError)
    );
  }

  // Consultar un rol por ID
  consultarRol(id: number): Observable<RolDTO> {
    return this.http.get<RolDTO>(`${this.urlBase}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un rol
  actualizarRol(id: number, rol: RolCreacionDTO): Observable<RespuestaAPIRol> {
    return this.http.put<RespuestaAPIRol>(`${this.urlBase}${id}`, rol).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un rol
  eliminarRol(id: number): Observable<RespuestaAPIRol> {
    return this.http.delete<RespuestaAPIRol>(`${this.urlBase}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Se produjo un error:', error);
    return throwError(() => new Error('Ha ocurrido un error, por favor inténtelo más tarde.'));
  }
}

