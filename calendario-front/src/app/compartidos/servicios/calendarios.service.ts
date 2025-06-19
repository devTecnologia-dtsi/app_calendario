import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment.development';
import { environment } from '../../../environments/environment';
import { CalendarioCreacionDTO, CalendarioRespuestaConsultaAPI, CalendarioRespuestaCreacionAPI } from '../../calendarios/calendarios';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendariosService {

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = `${environment.apiUrl}calendario/`;

  // Listar todos los calendarios
  listarCalendarios(): Observable<CalendarioRespuestaCreacionAPI> {
    return this.http.get<CalendarioRespuestaCreacionAPI>(this.urlBase).pipe(catchError(this.handleError));
  }

  // Consultar un calendario para editar
  consultarCalendario(id: number): Observable<CalendarioRespuestaConsultaAPI> {
    return this.http.get<CalendarioRespuestaConsultaAPI>(`${this.urlBase}${id}`).pipe(catchError(this.handleError));
  }

  // Crear un calendario
  crearCalendario(calendario: CalendarioCreacionDTO): Observable<CalendarioRespuestaCreacionAPI> {
    return this.http.post<CalendarioRespuestaCreacionAPI>(this.urlBase, calendario).pipe(catchError(this.handleError));
  }

  // Actualizar un calendario
  actualizarCalendario(id: number, calendario: CalendarioCreacionDTO): Observable<CalendarioRespuestaConsultaAPI> {
    return this.http.put<CalendarioRespuestaConsultaAPI>(`${this.urlBase}${id}`, calendario).pipe(
      catchError(this.handleError)
    );
  }

  // Desactivar un calendario
  desactivarCalendario(id: number): Observable<CalendarioRespuestaConsultaAPI> {
    return this.http.patch<CalendarioRespuestaConsultaAPI>(`${this.urlBase}${id}`, {}).pipe(catchError(this.handleError));
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

