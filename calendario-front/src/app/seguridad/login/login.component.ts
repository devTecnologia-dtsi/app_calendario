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

  // Inyección de dependencias
  private authService = inject(AuthService);
  private router = inject(Router);
  private NotificacionService = inject(NotificacionService);

  async login(): Promise<void> {

    if (this.cargando) return;
    
    this.cargando = true;
    try {

      await this.authService.cargarPermisosRoles();

      // 1. Iniciar sesión con Microsoft
      await this.authService.iniciarSesion();

      // 2. Validar con tu backend si el usuario existe
      const validado = await this.authService.validarConBackend();

      // 3. Redirigir si todo va bien
      if (validado) {
        this.router.navigate(['/dashboard']);
      } else {
        this.NotificacionService.mostrarError('Tu cuenta no está registrada en la base de datos.');
        await this.authService.cerrarSesion(); // Para cerrar sesión de Microsoft si no existe en BD
      }

    } catch (error) {
      console.error('Error en login:', error);
      this.NotificacionService.mostrarError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      this.cargando = false;
    }
  }
}