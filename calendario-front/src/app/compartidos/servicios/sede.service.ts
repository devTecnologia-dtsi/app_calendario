import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Sede {
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
  private urlBase = environment.apiUrl + '/sedesPorRectoria/';

  listarSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.urlBase}`);
  }

  listarSedesPorRectoria(id: number): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.urlBase}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Se produjo un error', error);
    return throwError('Ha ocurrido un error, por favor inténtelo más tarde.');
  }
}
