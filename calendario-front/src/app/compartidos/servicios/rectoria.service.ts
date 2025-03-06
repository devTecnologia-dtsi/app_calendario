import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment.development';


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
  private urlBase = environment.apiUrl + '/rectoria/';

  listarRectorias(): Observable<Rectoria[]> {
    return this.http.get<Rectoria[]>(`${this.urlBase}`).pipe(
      catchError(this.handleError)
    );
  }

    private handleError(error: any) {
      console.error('Se produjo un error',error);
      return throwError('Ha ocurrido un error, por favor inténtelo más tarde.');
    }
}