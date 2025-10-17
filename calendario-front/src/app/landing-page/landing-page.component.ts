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
import { Router } from '@angular/router';

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
  private router = inject(Router);

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

  // Helper que verifica si tiene permiso específico O es admin
  private tienePermisoOEsAdmin(
    tipo: 'admin' | 'academico' | 'financiero' | 'grados',
    accion: 'crear' | 'leer' | 'actualizar' | 'borrar'
  ): boolean {
    // Si es admin, tiene todos los permisos sobre todos los tipos
    if (this.authService.tienePermisoPara('admin', accion)) {
      return true;
    }
    
    // Si no es admin, verificar el permiso específico del tipo
    return this.authService.tienePermisoPara(tipo, accion);
  }

  puedeCrear(tipo: 'admin' | 'academico' | 'financiero' | 'grados'): boolean {
    return this.tienePermisoOEsAdmin(tipo, 'crear');
  }

  puedeActualizar(tipo: 'admin' | 'academico' | 'financiero' | 'grados'): boolean {
    return this.tienePermisoOEsAdmin(tipo, 'actualizar');
  }

  puedeEliminar(tipo: 'admin' | 'academico' | 'financiero' | 'grados'): boolean {
    return this.tienePermisoOEsAdmin(tipo, 'borrar');
  }

  puedeVer(tipo: 'admin' | 'academico' | 'financiero' | 'grados'): boolean {
    return this.tienePermisoOEsAdmin(tipo, 'leer');
  }

  debugNavegacion(tipo: string): void {
    //console.log('Click en botón crear:', tipo);
    //console.log('RouterLink apunta a:', `/calendarios/crear/${tipo}`);
    // console.log('URL actual:', this.router.url);
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