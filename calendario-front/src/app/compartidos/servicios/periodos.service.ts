import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { PeriodoCreacionDTO, RespuestaAPIPeriodo } from '../../calendarios/calendarios';

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {

  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + 'periodoAcademico/';

  // Listar todos los periodos
  listarPeriodos() {
    return this.http.get<RespuestaAPIPeriodo>(this.urlBase).pipe(catchError(this.handleError));
  }

  // Consultar un periodo por ID
  consultarPeriodo(id: number) {
    return this.http.get<RespuestaAPIPeriodo>(`${this.urlBase}${id}`).pipe(catchError(this.handleError));
  }

  // Crear un periodo
  crearPeriodo(periodo: PeriodoCreacionDTO): Observable<RespuestaAPIPeriodo> {
    return this.http.post<RespuestaAPIPeriodo>(this.urlBase, periodo).pipe(catchError(this.handleError));
  }

  // Actualizar un periodo
  actualizarPeriodo(id: number, periodo: PeriodoCreacionDTO): Observable<RespuestaAPIPeriodo> {
    return this.http.put<RespuestaAPIPeriodo>(`${this.urlBase}${id}`, periodo).pipe(catchError(this.handleError));
  }

  // Desactivar un periodo
  desactivarPeriodo(id: number): Observable<RespuestaAPIPeriodo> {
    return this.http.patch<RespuestaAPIPeriodo>(`${this.urlBase}${id}`, {}).pipe(catchError(this.handleError));
  }

  // Eliminar un periodo
  eliminarPeriodo(id: number): Observable<void> {
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
