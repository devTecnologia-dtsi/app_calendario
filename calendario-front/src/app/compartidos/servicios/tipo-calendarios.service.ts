import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { RespuestaAPITipoCalendario } from '../../calendarios/calendarios';

@Injectable({
  providedIn: 'root'
})
export class TipoCalendariosService {

  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + 'tipoCalendarios';

  // Listar todos los tipos de calendario
  listarTiposCalendarios() {
    return this.http.get<RespuestaAPITipoCalendario>(this.urlBase).pipe(catchError(this.handleError));
  }

  // Consultar un tipo de calendario por ID
  consultarTipoCalendario(id: number) {
    return this.http.get<RespuestaAPITipoCalendario>(`${this.urlBase}/${id}`).pipe(catchError(this.handleError));
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
