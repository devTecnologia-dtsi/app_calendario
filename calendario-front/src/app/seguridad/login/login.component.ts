import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login(): Promise<void> {
    this.cargando = true;

    try {
      // 1. Iniciar sesión con Microsoft
      await this.authService.iniciarSesion();

      // 2. Validar con tu backend si el usuario existe
      const validado = await this.authService.validarConBackend();

      // 3. Redirigir si todo va bien
      if (validado) {
        this.router.navigate(['/dashboard']);
      } else {
        alert('Tu cuenta no está registrada en la base de datos.');
        await this.authService.cerrarSesion(); // Para cerrar sesión de Microsoft si no existe en BD
      }

    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      this.cargando = false;
    }
  }
}