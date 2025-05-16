import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';


  // Respuesta de la API
export interface RespuestaAPI {
  status: number;
  message: string;
  data: Rectoria [];
}

export interface Rectoria {
  id: number;
  codigo: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class RectoriaService {

  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + 'rectoria/';
  
  listarRectorias(): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}`).pipe(
      catchError(this.handleError)
    );
  }

  listarRectoriasPorUsuario(): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}rectoriasPorUsuario`).pipe(
      catchError(this.handleError)
    );
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
