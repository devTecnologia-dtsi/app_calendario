import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RolCreacionDTO, RolDTO } from '../rol';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RolService } from '../../compartidos/servicios/rol.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
import { extraerErrores } from '../../compartidos/funciones/extraerErrores';

@Component({
  selector: 'app-indice-rol',
  standalone: true,
  imports: [
    // Angular Material Modules
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indice-rol.component.html',
  styleUrls: ['./indice-rol.component.css']
})
export class IndiceRolComponent implements OnInit, AfterViewInit {
  
  // Propiedades
  errores: string[] = [];
  columnasMostradas: string[] = [
    'Nombre',
    'Crear',
    'Leer',
    'Actualizar',
    'Borrar',
    'Actividad',
    'Subactividad',
    'Calendario',
    'Sistema',
    'Acciones'
  ];
  fuenteDatos = new MatTableDataSource<RolDTO>([]);

  // Inyección de dependencias
  private notificacionService = inject(NotificacionService);
  private rolService = inject(RolService);

  // Métodos del ciclo de vida
  ngOnInit(): void {
    this.cargarRoles();
  }

  ngAfterViewInit(): void {
  }

  // Métodos
  cargarRoles(): void {
    this.rolService.listarRoles().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.fuenteDatos.data = response.data;
        } else {
          this.fuenteDatos.data = [];
          this.notificacionService.mostrarError('No se encontraron roles.');
        }
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.notificacionService.mostrarError('Error al cargar los roles.');
      }
    });
  }

  cambioCheckbox(rol: RolDTO, permiso: string, event: any): void {
    rol[permiso] = event.checked ? 1 : 0;
  }

  guardarCambios(rol: RolDTO): void {
    const rolActualizado: RolCreacionDTO = {
      crear: rol.crear,
      leer: rol.leer,
      actualizar: rol.actualizar,
      borrar: rol.borrar,
      actividad: rol.actividad,
      subactividad: rol.subactividad,
      calendario: rol.calendario,
      sistema: rol.sistema,
      nombre: rol.nombre
    };

    this.rolService.actualizarRol(rol.id, rolActualizado).subscribe({
      next: (respuesta) => {
        if (respuesta.status === 1) {
          this.notificacionService.mostrarExito(respuesta.message || 'Rol actualizado correctamente');
        
        } else if (respuesta.status === 2) {
          this.notificacionService.mostrarAdvertencia(respuesta.message || 'No se realizaron cambios en el Rol');
        
        } else {
          this.notificacionService.mostrarError(respuesta.message || 'Error al actualizar el Rol');
        }
      },
      error: (error) => {
        this.errores = extraerErrores(error);
        this.notificacionService.mostrarError('Error en la actualización');
      }
    });
  }
}



