import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";

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
    CargandoComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indice-rol.component.html',
  styleUrls: ['./indice-rol.component.css']
})
export class IndiceRolComponent implements OnInit, AfterViewInit {
  
  // Propiedades
  errores: string[] = [];
  cargando = false;
  columnasMostradas: string[] = [
    'Nombre',
    'Crear',
    'Leer',
    'Actualizar',
    'Borrar',
    'Acciones'
  ];
  fuenteDatos = new MatTableDataSource<RolDTO>([]);

  // Inyección de dependencias
  private notificacionService = inject(NotificacionService);
  private rolService = inject(RolService);
  private cd =  inject(ChangeDetectorRef);

  // Métodos del ciclo de vida
  ngOnInit(): void {
    this.cargarRoles();
  }

  ngAfterViewInit(): void {
  }

  // Métodos
  cargarRoles(): void {
    this.cargando = true;
    console.log('Cargando roles...');
    this.rolService.listarRoles().subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        if (response && Array.isArray(response.data)) {
          this.fuenteDatos.data = response.data;
        } else {
          this.fuenteDatos.data = [];
          this.notificacionService.mostrarError('No se encontraron roles.');
        }
        this.cargando = false;
        this.cd.markForCheck(); // Asegura que la vista se actualice
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.notificacionService.mostrarError('Error al cargar los roles.');
        this.cargando = false;
        this.cd.markForCheck(); // Asegura que la vista se actualice
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



