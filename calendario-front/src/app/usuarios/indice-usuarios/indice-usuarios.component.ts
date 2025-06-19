import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// Importaciones de servicios y modelos
import { UsuarioDTO } from '../usuario';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";

@Component({
  selector: 'app-indice-usuarios',
  standalone: true,
  imports: [RouterLink,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule, CargandoComponent],
  templateUrl: './indice-usuarios.component.html',
  styleUrls: ['./indice-usuarios.component.css']
})
export class IndiceUsuariosComponent implements OnInit {

  filtroActual = '';
  cargando = false;
  
  // Inyecciones de servicios
  usuarioService = inject(UsuarioService);
  notificacionService = inject(NotificacionService);

  // Propiedades
  usuarios: UsuarioDTO[] = [];
  dataSource = new MatTableDataSource<UsuarioDTO>();
  columnasAMostrar = ['id', 'correo', 'nombre_rectoria', 'nombre_sede', 'fechaCreacion', 'nombre_rol', 'acciones'];

  // Control de paginación
  totalUsuarios = 0;
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inicialización
  ngOnInit() {
    this.listarUsuarios();
  }

  // Obtener usuarios paginados
  listarUsuarios() {
    this.cargando = true;
    const limite = this.pageSize;
    const offset = this.pageIndex * this.pageSize;

    this.usuarioService.listarUsuarios(limite, offset, this.filtroActual).subscribe({
      next: (respuesta) => {
        if (respuesta.status === 1) {
          this.usuarios = Array.isArray(respuesta.data) ? respuesta.data : [];
          this.dataSource.data = this.usuarios;
          this.totalUsuarios = respuesta.total || 0;
        } else {
          this.notificacionService.mostrarAdvertencia(respuesta.message || 'No se encontraron usuarios', 'Aviso');
        }
        this.cargando = false;
      },
      error: (error) => this.notificacionService.mostrarError('Error al listar usuarios')
    });
  }

  // Cambiar de página en la paginación
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.listarUsuarios();
  }

  // Filtro de búsqueda
  aplicarFiltro(event: Event) {
    this.filtroActual = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex = 0; // Reiniciar a primera página
    this.listarUsuarios();
  }

  // aplicarFiltro(event: Event) {
  //   const filtroValor = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filtroValor.trim().toLowerCase();
  // }

  // Desactivar usuario
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
