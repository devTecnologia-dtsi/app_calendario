import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { ActividadCreacionDTO, RespuestaAPIActividades } from '../../calendarios/calendarios';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + 'subactividad';

  listarActividades(): Observable<RespuestaAPIActividades> {
    return this.http.get<RespuestaAPIActividades>(`${this.urlBase}`).pipe(catchError(this.handleError));
  }

  listarActividadesPorId (id: number): Observable<RespuestaAPIActividades> {
    return this.http.get<RespuestaAPIActividades>(`${this.urlBase}/${id}`).pipe(catchError(this.handleError));
  }

  crearActividad(actividad: ActividadCreacionDTO): Observable<RespuestaAPIActividades> {
    return this.http.post<RespuestaAPIActividades>(this.urlBase, actividad).pipe(catchError(this.handleError));
  }

  actualizarActividad(id: number, actividad: ActividadCreacionDTO): Observable<RespuestaAPIActividades> {
    return this.http.put<RespuestaAPIActividades>(`${this.urlBase}/${id}`, actividad).pipe(catchError(this.handleError));
  }

  desactivarActividad(id: number): Observable<RespuestaAPIActividades> {
    return this.http.patch<RespuestaAPIActividades>(`${this.urlBase}/${id}`, {}).pipe(catchError(this.handleError));
  }

  eliminarActividad(id: number): Observable<void> {return this.http.delete<void>(`${this.urlBase}/${id}`).pipe
    (catchError(this.handleError));
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
