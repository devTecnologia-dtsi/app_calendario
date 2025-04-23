import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RespuestaAPISubactividades } from '../../calendarios/calendarios';

@Injectable({
  providedIn: 'root'
})
export class SubactividadesService {

    private http = inject(HttpClient);
    private urlBase = environment.apiUrl + 'subactividad/';
  
    // Listar todas las subactividades
    listarSubactividades() {
        return this.http.get<RespuestaAPISubactividades>(this.urlBase);
    }

    // Consultar una subactividad por ID
    consultarSubactividad(id: number) {
        return this.http.get<RespuestaAPISubactividades>(`${this.urlBase}${id}`);
    }

    // Crear una subactividad
    crearSubactividad(subactividad: any) {
        return this.http.post<RespuestaAPISubactividades>(this.urlBase, subactividad);
    }

    // Actualizar una subactividad
    actualizarSubactividad(id: number, subactividad: any) {
        return this.http.put<RespuestaAPISubactividades>(`${this.urlBase}${id}`, subactividad);
    }

    // Desactivar una subactividad
    desactivarSubactividad(id: number) {
        return this.http.patch<RespuestaAPISubactividades>(`${this.urlBase}${id}`, {});
    }

    // Eliminar una subactividad
    eliminarSubactividad(id: number) {
        return this.http.delete<void>(`${this.urlBase}${id}`);
    }
}
