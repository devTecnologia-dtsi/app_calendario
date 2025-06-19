import { inject, Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


export interface RespuestaAPITiposPeriodo {
    status: number;
    message: string;
    data: TiposPeriodoDTO[];
}
export interface TiposPeriodoDTO {
  id: number;
  nombre: string;
}


@Injectable({
  providedIn: 'root'
})
export class TiposPeriodoService {

    private http = inject(HttpClient);
    private urlBase = environment.apiUrl + 'tiposPeriodo/';

    // Listar todos los tipos de periodo
    listarTiposPeriodo() {
        return this.http.get<RespuestaAPITiposPeriodo>(this.urlBase);
    }

    // Consultar un tipo de periodo por ID
    consultarTipoPeriodo(id: number) {
        return this.http.get<RespuestaAPITiposPeriodo>(`${this.urlBase}${id}`);
    }


}
