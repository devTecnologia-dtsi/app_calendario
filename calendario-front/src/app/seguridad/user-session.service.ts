import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private tokenKey = 'auth_token'; // nombre único para el token
  private token: string | null = null;

  // Guarda solo el token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtiene el token (de memoria o localStorage)
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(this.tokenKey);
    }
    return this.token;
  }

  // Limpia la sesión (por logout o expiración)
  limpiarSesion() {
    this.token = null;
    localStorage.removeItem(this.tokenKey);
  }

  // Método opcional: saber si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > now;
    } catch {
      return false;
    }
  }
}
