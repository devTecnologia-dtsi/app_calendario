import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.development';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AccesoUsuarioService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient,
  ) {}

  accesoUsuario(correo: string, accion: string): Observable<any> {
    const body = {
      "email": correo,
      "accion": accion
    };

    // Llamada al pipeline de Digibee que ejecuta el SP para obtener el rol del usuario
    return this.http.post<any>(`URL_DEL_PIPELINE_DIGIBEE`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(
        `Código de error ${error.status}, ` +
        `mensaje: ${error.error}`);
    }
    return throwError('Ocurrió un error de conexión; por favor, inténtalo de nuevo más tarde.');
  }

  decodeDataUser(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<{ dataT: any }>(token!);
      return decodedToken;
    } else {
      return;
    }
  }
}
