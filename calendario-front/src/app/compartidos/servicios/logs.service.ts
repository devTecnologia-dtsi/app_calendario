import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';

// Lectura
export interface LogsDTO 
{
    id: number;
    estado: number;
    fecha: Date;
    descripcion: string;
    correo: string;
}

export interface respuestaApiLogs
{
    status: number;
    message: string;
    data: LogsDTO[];
    total: number;
}

@Injectable({
  providedIn: 'root'
})

export class LogsService {
    private http = inject(HttpClient);
    private urlBase = environment.apiUrl + 'logs';

  listarLogs(limite: number, offset: number, filtro: string = ''): Observable<respuestaApiLogs> {
      const url = `${this.urlBase}/?limite=${limite}&offset=${offset}&filtro=${encodeURIComponent(filtro)}`;
      return this.http.get<respuestaApiLogs>(url).pipe(catchError(this.handleError));
  }

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
