import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  cargando = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private notificacionService = inject(NotificacionService);

  async login(): Promise<void> {
    if (this.cargando) return;

    this.cargando = true;
    try {
      // 1. Iniciar sesión con Microsoft (loginPopup)
      await this.authService.iniciarSesion();

      // 2. Validar con tu backend si el usuario existe
      const validado = await this.authService.validarConBackend();

      if (validado) {
        // 3. Cargar permisos solo si el usuario está validado
        await this.authService.cargarPermisosRoles();

        // 4. Redirigir al dashboard
        await this.router.navigate(['/dashboard']);
      } else {
        this.notificacionService.mostrarError('Tu cuenta no está registrada en la base de datos.');
        await this.authService.cerrarSesion();
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.notificacionService.mostrarError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      this.cargando = false;
    }
  }
}