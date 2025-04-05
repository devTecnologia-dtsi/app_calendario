import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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

    listarSedesPorRectoria(id_rectoria: number): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}sedesPorRectoria/${id_rectoria}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Se produjo un error', error);
    return throwError(() => new Error('Ha ocurrido un error, por favor inténtelo más tarde.'));
  }
}