// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { catchError, Observable, throwError } from 'rxjs';
// import { RolDTO, RolCreacionDTO } from '../../rol/rol';
// import { environment } from '../../../environments/environment.development';

// @Injectable({
//   providedIn: 'root'
// })
// export class RolService {

//   private http = inject(HttpClient);
//   private urlBase = environment.apiUrl + 'rol/';

//   listarRoles(): Observable<RolDTO[]> {
//     return this.http.get<RolDTO[]>(`${this.urlBase}`).pipe(
//       catchError(this.handleError)
//     );
//   }

//   actualizarRol(id: number, rol: RolCreacionDTO): Observable<void> {
//     return this.http.put<void>(`${this.urlBase}${id}`, rol).pipe(
//       catchError(this.handleError)
//     );
//   }

//   eliminarRol(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.urlBase}${id}`).pipe(
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: any) {
//     console.error('Se produjo un error', error);
//     return throwError('Ha ocurrido un error, por favor inténtelo más tarde.');
//   }
// }


import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RolDTO, RolCreacionDTO } from '../../rol/rol';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}rol/`;

  // Listar todos los roles
  listarRoles(): Observable<RolDTO[]> {
    return this.http.get<RolDTO[]>(this.urlBase).pipe(
      catchError(this.handleError)
    );
  }

  // Consultar un rol por ID
  consultarRol(id: number): Observable<RolDTO> {
    return this.http.get<RolDTO>(`${this.urlBase}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un rol
  actualizarRol(id: number, rol: RolCreacionDTO): Observable<void> {
    return this.http.put<void>(`${this.urlBase}${id}`, rol).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un rol
  eliminarRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Se produjo un error:', error);
    return throwError(() => new Error('Ha ocurrido un error, por favor inténtelo más tarde.'));
  }
}

