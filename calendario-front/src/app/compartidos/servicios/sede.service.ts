import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';


// Respuesta de la API
export interface RespuestaAPI {
  status: number;
  message: string;
  data: SedeDTO [];
}

export interface SedeDTO {
  id: number;
  codigo: string;
  nombre: string;
  id_rectoria: number;
}

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  private http = inject(HttpClient);
  private urlBase = environment.apiUrl;

  // Listar todas las sedes
  listarSedes(): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}sede/`).pipe(
      catchError(this.handleError)
    );
  }

  listarSedesPorUsuario(): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}sedesPorUsuario`).pipe(
      catchError(this.handleError)
    );
  }


  listarSedesPorRectoria(id_rectoria: number): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}sedesPorRectoria/${id_rectoria}`).pipe(
      catchError(this.handleError)
    );
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