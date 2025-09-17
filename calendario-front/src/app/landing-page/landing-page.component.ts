import { Component, inject, OnInit } from '@angular/core';
import { CalendariosService } from '../compartidos/servicios/calendarios.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NotificacionService } from '../compartidos/servicios/notificacion.service';
import { AuthService } from '../seguridad/auth.service';
import { CargandoComponent } from "../compartidos/componentes/cargando/cargando.component";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    CargandoComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  calendariosAcademicos: any[] = [];
  calendariosFinancieros: any[] = [];
  calendariosGrados: any[] = [];
  cargando = false;

  private calendariosService = inject(CalendariosService);
  private notificacion = inject(NotificacionService);
  private authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    // Validar si han cambiado los permisos del usuario (con caché de 10 min)
    await this.authService.cargarPermisosRoles();

    this.cargarCalendarios();
  }

  cargarCalendarios(): void {
    const correoUsuario = this.authService.activeAccount?.username;

    this.cargando = true;
    this.calendariosService.listarCalendarios()
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (res) => {
          const calendarios = Array.isArray(res.data) ? res.data : [];

          // console.log('Correo usuario:', correoUsuario);
          // console.log('Calendarios recibidos:', calendarios);

          const visibles = calendarios.filter((cal: any) =>
            cal.correo_organizador === correoUsuario
          );

          // Normalizar tipo_calendario
          this.calendariosAcademicos = visibles.filter(c => c.tipo_calendario?.toLowerCase() === 'académico');
          this.calendariosFinancieros = visibles.filter(c => c.tipo_calendario?.toLowerCase() === 'financiero');
          this.calendariosGrados = visibles.filter(c => c.tipo_calendario?.toLowerCase() === 'grados');
        },
        error: (err) => {
          this.notificacion.mostrarError('Error al cargar los calendarios');
          console.error('Error al cargar los calendarios:', err);
        }
      });
  }

  puedeCrear(tipo: 'academico' | 'financiero' | 'grados'): boolean {
    return this.authService.tienePermisoPara(tipo, 'crear');
  }

  puedeActualizar(tipo: 'academico' | 'financiero' | 'grados'): boolean {
    return this.authService.tienePermisoPara(tipo, 'actualizar');
  }

  puedeEliminar(tipo: 'academico' | 'financiero' | 'grados'): boolean {
    return this.authService.tienePermisoPara(tipo, 'borrar');
  }

  puedeVer(tipo: 'academico' | 'financiero' | 'grados'): boolean {
    return this.authService.tienePermisoPara(tipo, 'leer');
  }

  async desactivarCalendario(id: number) {
    const confirmacion = await this.notificacion.mostrarConfirmacion(
      '¿Estás seguro de que deseas desactivar este calendario?',
      'Confirmación'
    );

    if (!confirmacion) return;

    this.calendariosService.desactivarCalendario(id).subscribe({
      next: (res) => {
        if (res.status === 1) {
          this.notificacion.mostrarExito(res.message || 'Calendario desactivado correctamente');
          this.cargarCalendarios();
        } else {
          this.notificacion.mostrarError(res.message || 'No se pudo desactivar el calendario');
        }
      },
      error: () => this.notificacion.mostrarError('Error al desactivar el calendario')
    });
  }
}
