import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioCreacionDTO } from '../../usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:82/calendario-back/src/routes/rutas.php/insertarusuario';
  
  constructor(private http:HttpClient) {}

  insertarUsuario(usaurio: UsuarioCreacionDTO) {
    return this.http.post<any>(this.apiUrl, usaurio);
  }
}
