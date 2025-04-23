import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CalendarioCreacionDTO, CalendarioRespuestaAPI } from '../../calendarios/calendarios';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendariosService {

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = `${environment.apiUrl}calendario/`;

  // Listar todos los calendarios
  listarCalendarios() {
    return this.http.get<CalendarioRespuestaAPI>(this.urlBase).pipe(catchError(this.handleError));    
  }

  // Consultar un calendario por ID
  consultarCalendario(id: number) {
    return this.http.get<CalendarioRespuestaAPI>(`${this.urlBase}${id}`).pipe(catchError(this.handleError));
  }

  // Crear un calendario
  crearCalendario(calendario: CalendarioCreacionDTO): Observable<CalendarioRespuestaAPI> {
    return this.http.post<CalendarioRespuestaAPI>(this.urlBase, calendario).pipe(catchError(this.handleError));
  }

  // Actualizar un calendario
  actualizarCalendario(id: number, calendario: CalendarioCreacionDTO): Observable<CalendarioRespuestaAPI> {
    return this.http.put<CalendarioRespuestaAPI>(`${this.urlBase}${id}`, calendario).pipe(catchError(this.handleError));
  }

  // Desactivar un calendario
  desactivarCalendario(id: number): Observable<CalendarioRespuestaAPI> {
    return this.http.patch<CalendarioRespuestaAPI>(`${this.urlBase}${id}`, {}).pipe(catchError(this.handleError));
  }

  // Eliminar un calendario
  eliminarCalendario(id: number): Observable<void> {
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
