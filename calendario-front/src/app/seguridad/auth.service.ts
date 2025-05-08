import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginEndpoint = `${environment.apiUrl}usuarioPorCorreo`;

  constructor(
    private msal: MsalService,
    private http: HttpClient
  ) {}

  get activeAccount(): AccountInfo | null {
    return this.msal.instance.getActiveAccount();
  }

  async iniciarSesion(): Promise<void> {
    const result = await firstValueFrom(this.msal.loginPopup());
    if (result?.account) {
      this.msal.instance.setActiveAccount(result.account);
    }
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.msal.logoutRedirect();
  }

  async validarConBackend(): Promise<boolean> {
    const account = this.activeAccount;
    if (!account) return false;

    try {
      const respuesta: any = await firstValueFrom(
        this.http.post(this.loginEndpoint, { correo: account.username })
      );

      if (respuesta?.token) {
        try {
          localStorage.setItem('jwt_token', respuesta.token);
          localStorage.setItem('usuario_info', JSON.stringify(respuesta.usuario));
        } catch (e) {
          console.error('Error guardando en localStorage:', e);
          return false;
        }
        return true;
      } else {
        alert('Tu cuenta no está registrada en la base de datos.');
        this.cerrarSesion();
        return false;
      }
    } catch (error) {
      console.error('Error al validar con backend:', error);
      this.cerrarSesion();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getUsuarioInfo(): any {
    const raw = localStorage.getItem('usuario_info');
    return raw ? JSON.parse(raw) : null;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }
}
