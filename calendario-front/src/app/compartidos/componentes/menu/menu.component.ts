import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../seguridad/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombreUsuario: string | null = null;
  correoUsuario: string | null = null;
  fotoUsuario: string | null = null;

  esAdmin(): boolean {
    return this.authService.getRoles().includes(1); // id_rol = 1 es admin
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }

  // async ngOnInit() {
  //   this.nombreUsuario = this.authService.getNombreUsuario();
  //   this.correoUsuario = this.authService.getEmailUsuario();
  //   this.fotoUsuario = await this.authService.getFotoUsuario();
  // }

}
