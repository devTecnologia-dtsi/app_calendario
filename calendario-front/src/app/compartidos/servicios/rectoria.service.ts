import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // listarRectorias(): Observable<Rectoria[]> {
  //   return this.http.get<Rectoria[]>(`${this.urlBase}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  
  listarRectorias(): Observable<RespuestaAPI> {
    return this.http.get<RespuestaAPI>(`${this.urlBase}`).pipe(
      catchError(this.handleError)
    );
  }

    private handleError(error: any) {
      console.error('Se produjo un error',error);
      return throwError('Ha ocurrido un error, por favor inténtelo más tarde.');
    }
}

// import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError, catchError, map } from 'rxjs';
// import { environment } from '../../../environments/environment.development';

// export interface Rectoria {
//   id: number;
//   codigo: string;
//   nombre: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class RectoriaService {
//   private http = inject(HttpClient);
//   private urlBase = environment.apiUrl + 'rectoria/';

//   // Listar todas las rectorías
//   listarRectorias(): Observable<Rectoria[]> {
//     return this.http.get<any>(this.urlBase).pipe(
//       map(response => {
//         if (response && Array.isArray(response.data)) {
//           return response.data;
//         } else {
//           console.error('Error: No se encontró el array "data" en la respuesta');
//           return [];
//         }
//       }),
//       catchError(this.handleError)
//     );
//   }
  
  
//   // listarRectorias(): Observable<Rectoria[]> {
//   //   return this.http.get<Rectoria[]>(`${this.urlBase}`).pipe(
//   //     catchError(this.handleError)
//   //   );
//   // }


//   // Consultar una rectoría por ID
//   consultarRectoria(id: number): Observable<Rectoria> {
//     return this.http.get<Rectoria>(`${this.urlBase}${id}`).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // Manejo de errores
//   private handleError(error: any) {
//     console.error('Se produjo un error', error);
//     return throwError(() => new Error('Ha ocurrido un error, por favor inténtelo más tarde.'));
//   }
// }
