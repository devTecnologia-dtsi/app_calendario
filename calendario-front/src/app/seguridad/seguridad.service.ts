import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor() { }

  estaLogeado(): boolean {
    // return localStorage.getItem('token') !== null;
    return false; // Cambiar a false para simular no logueado
  }

  obtenerRol(): string {
    return 'administrador'; // Cambiar a 'user' para simular un usuario normal
  }
}
