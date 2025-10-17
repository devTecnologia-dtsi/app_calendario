import { Component, OnInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize, Subject, debounceTime, distinctUntilChanged, takeUntil, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UsuarioDTO } from '../usuario';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';

@Component({
  selector: 'app-indice-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './indice-usuarios.component.html',
  styleUrls: ['./indice-usuarios.component.css']
})
export class IndiceUsuariosComponent implements OnInit, OnDestroy {

  filtroActual = '';
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  cargando = false;

  usuarioService = inject(UsuarioService);
  notificacionService = inject(NotificacionService);

  usuarios: UsuarioDTO[] = [];
  dataSource = new MatTableDataSource<UsuarioDTO>();

  // Mostramos más info relevante (rectorías y roles de los permisos)
  columnasAMostrar = ['id', 'correo', 'estado', 'fecha_creacion', 'acciones'];

  totalUsuarios = 0;
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    // Configurar búsqueda con debounce
    this.search$
      .pipe(
        debounceTime(300),
        map((v) => (v ?? '').trim().toLowerCase()),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((texto) => {
        this.filtroActual = texto;
        this.pageIndex = 0;
        this.listarUsuarios();
      });

    // Carga inicial
    this.listarUsuarios();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listarUsuarios() {
    this.cargando = true;
    const limite = this.pageSize;
    const offset = this.pageIndex * this.pageSize;

    this.usuarioService.listarUsuarios(limite, offset, this.filtroActual)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (respuesta) => {
          if (respuesta.status === 1) {
            this.usuarios = Array.isArray(respuesta.data) ? respuesta.data : [];
            // Si el SP devuelve usuarios planos, aquí podrías mapearlos
            this.dataSource.data = this.usuarios;
            this.dataSource.sort = this.sort;
            this.totalUsuarios = respuesta.total || 0;
          } else {
            this.manejarErrorListado(respuesta.message || 'No se encontraron usuarios');
          }
        },
        error: () => this.manejarErrorListado('Error al listar usuarios')
      });
  }

  private manejarErrorListado(mensaje: string) {
    this.notificacionService.mostrarAdvertencia(mensaje, 'Aviso');
    this.usuarios = [];
    this.dataSource.data = [];
    this.totalUsuarios = 0;
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.listarUsuarios();
  }

  aplicarFiltro(event: Event) {
    const valor = (event.target as HTMLInputElement).value || '';
    this.search$.next(valor);
  }

  async desactivarUsuario(id: number) {
    const confirmacion = await this.notificacionService.mostrarConfirmacion(
      '¿Seguro que quieres desactivar este usuario?',
      'Confirmación'
    );

    if (confirmacion) {
      this.usuarioService.desactivarUsuario(id).subscribe({
        next: (respuesta) => {
          if (respuesta.status === 1) {
            this.notificacionService.mostrarExito(respuesta.message || 'Usuario desactivado correctamente');
            this.listarUsuarios();
          } else {
            this.notificacionService.mostrarError(respuesta.message || 'No se pudo desactivar el usuario');
          }
        },
        error: () => this.notificacionService.mostrarError('Error al desactivar el usuario')
      });
    }
  }

  // Helpers para mostrar los permisos de forma legible en la tabla
  obtenerRectorias(usuario: UsuarioDTO): string {
    if (!usuario.permisos?.length) return '—';
    const nombres = usuario.permisos.map(p => p.nombre_rectoria);
    return [...new Set(nombres)].join(', ');
  }

  obtenerRoles(usuario: UsuarioDTO): string {
    if (!usuario.permisos?.length) return '—';
    const nombres = usuario.permisos.map(p => p.nombre_rol);
    return [...new Set(nombres)].join(', ');
  }

  obtenerEstadoTexto(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  obtenerClaseEstado(estado: number): string {
    return estado === 1 ? 'estado-activo' : 'estado-inactivo';
  }
}
