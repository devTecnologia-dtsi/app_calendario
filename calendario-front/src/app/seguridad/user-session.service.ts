import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private usuario: any = null;

  setUsuario(usuario: any) {
    this.usuario = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario() {
    if (!this.usuario) {
      const stored = localStorage.getItem('usuario');
      if (stored) {
        this.usuario = JSON.parse(stored);
      }
    }
    return this.usuario;
  }

  limpiarSesion() {
    this.usuario = null;
    localStorage.removeItem('usuario');
  }
}
