import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { RespuestaAPISubactividades, SubActividadCreacionDTO } from '../../calendarios/calendarios';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubactividadService {

  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + 'subactividad';

  listarSubactividades(): Observable<RespuestaAPISubactividades> {
    return this.http.get<RespuestaAPISubactividades>(`${this.urlBase}`).pipe(catchError(this.handleError));
  }

  listarSubactividadesPorId(id: number): Observable<RespuestaAPISubactividades> {
    return this.http.get<RespuestaAPISubactividades>(`${this.urlBase}/${id}`).pipe(catchError(this.handleError));
  }

  crearSubactividad(subactividad: SubActividadCreacionDTO): Observable<RespuestaAPISubactividades> {
    return this.http.post<RespuestaAPISubactividades>(this.urlBase, subactividad).pipe(catchError(this.handleError));
  }

  actualizarSubactividad(id: number, subactividad: SubActividadCreacionDTO): Observable<RespuestaAPISubactividades> {
    return this.http.put<RespuestaAPISubactividades>(`${this.urlBase}/${id}`, subactividad).pipe(catchError(this.handleError));
  }

  desactivarSubactividad(id: number): Observable<RespuestaAPISubactividades> {
    return this.http.patch<RespuestaAPISubactividades>(`${this.urlBase}/${id}`, {}).pipe(catchError(this.handleError));
  }

  eliminarSubactividad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
