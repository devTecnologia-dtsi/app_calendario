import { Component, OnInit, ViewChild, inject } from '@angular/core';
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

import { UsuarioDTO } from '../usuario';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';


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
export class IndiceUsuariosComponent implements OnInit {

  filtroActual = '';
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  cargando = false;

  usuarioService = inject(UsuarioService);
  notificacionService = inject(NotificacionService);

  usuarios: UsuarioDTO[] = [];
  dataSource = new MatTableDataSource<UsuarioDTO>();
  columnasAMostrar = ['id', 'correo', 'nombre_rectoria', 'nombre_sede', 'fechaCreacion', 'nombre_rol', 'acciones'];

  totalUsuarios = 0;
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    // Debounce de búsqueda
    this.search$
      .pipe(
        debounceTime(300),
        map((v) => (v ?? '').trim().toLowerCase()),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((texto) => {
        this.filtroActual = texto;
        this.pageIndex = 0; // volver a la primera página
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

    this.usuarioService.listarUsuarios(limite, offset, this.filtroActual || '')
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (respuesta) => {
          if (respuesta.status === 1) {
            this.usuarios = Array.isArray(respuesta.data) ? respuesta.data : [];
            this.dataSource.data = this.usuarios;
            this.dataSource.sort = this.sort; // orden en cliente (sobre la página actual)
            this.totalUsuarios = respuesta.total || 0;
          } else {
            this.notificacionService.mostrarAdvertencia(respuesta.message || 'No se encontraron usuarios', 'Aviso');
            this.usuarios = [];
            this.dataSource.data = [];
            this.totalUsuarios = 0;
          }
        },
        error: () => {
          this.notificacionService.mostrarError('Error al listar usuarios');
          this.usuarios = [];
          this.dataSource.data = [];
          this.totalUsuarios = 0;
        }
      });
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
}
