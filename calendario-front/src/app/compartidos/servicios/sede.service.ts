import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Sede {
  id: number;
  codigo: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  // private apiUrl = 'http://localhost/calendario-back/src/routes/rutas.php/sedesPorRectoria/';
  private apiUrl = 'http://localhost:82/sedesPorRectoria/';
;
  constructor(private http: HttpClient) {}

  listarSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.apiUrl}`);
  }

  listarSedesPorRectoria(id: number): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.apiUrl}${id}`);
  }
}
