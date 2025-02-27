import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rectoria {
  id: number;
  codigo: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class RectoriaService {
  private apiUrl = 'http://localhost/calendario-back/src/routes/rutas.php/rectoria/';

  constructor(private http: HttpClient) {}

  listarRectorias(): Observable<Rectoria[]> {
    return this.http.get<Rectoria[]>(`${this.apiUrl}`);
  }
}