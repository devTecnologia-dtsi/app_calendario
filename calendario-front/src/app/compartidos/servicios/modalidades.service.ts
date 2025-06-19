import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment.development';
import { environment } from '../../../environments/environment';
import { ModalidadCreacionDTO, ModalidadDTO, RespuestaAPIModalidad } from '../../calendarios/calendarios';
import { catchError, Observable, throwError } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ModalidadesService {

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = `${environment.apiUrl}modalidad/`;

  // Listar todas las modalidades
  listarModalidades() {
    return this.http.get<RespuestaAPIModalidad>(this.urlBase).pipe(catchError(this.handleError));    
  }

  // Consultar una modalidad por ID
  consultarModalidad(id: number) {
    return this.http.get<RespuestaAPIModalidad>(`${this.urlBase}${id}`).pipe(catchError(this.handleError));
  }

  // Crear una modalidad
  crearModalidad(modalidad: ModalidadCreacionDTO): Observable<RespuestaAPIModalidad> {
    return this.http.post<RespuestaAPIModalidad>(this.urlBase, modalidad).pipe(catchError(this.handleError));
  }

  // Actualizar una modalidad
  actualizarModalidad(id: number, modalidad: ModalidadCreacionDTO): Observable<RespuestaAPIModalidad> {
    return this.http.put<RespuestaAPIModalidad>(`${this.urlBase}${id}`, modalidad).pipe(catchError(this.handleError));
  }

  // Desactivar una modalidad
  desactivarModalidad(id: number): Observable<RespuestaAPIModalidad> {
    return this.http.patch<RespuestaAPIModalidad>(`${this.urlBase}${id}`, {}).pipe(catchError(this.handleError));
  }

  // Eliminar una modalidad
  eliminarModalidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}${id}`).pipe(catchError(this.handleError));
  }

  // Manejo de errores
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
