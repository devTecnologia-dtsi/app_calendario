import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RolCreacionDTO, RolDTO } from '../rol';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RolService } from '../../compartidos/servicios/rol.service';

@Component({
  selector: 'app-indice-rol',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
    HttpClientModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indice-rol.component.html',
  styleUrls: ['./indice-rol.component.css']
})
export class IndiceRolComponent implements AfterViewInit, OnInit {

  constructor(private rolService: RolService) {}

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit() {
    this.cargarRoles();
  }

  ngAfterViewInit() {
    this.fuenteDatos.paginator = this.paginator;
  }

  cargarRoles() {
    this.rolService.listarRoles().subscribe(data => {
      console.log(data); // Verifica los datos recibidos
      // this.fuenteDatos.data = data;
    });
  }

  cambioCheckbox(rol: RolDTO, permiso: string, event: any) {
    rol[permiso] = event.checked ? 1 : 0;
  }

  guardarCambios(rol: RolDTO) {
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

    this.rolService.actualizarRol(rol.id, rolActualizado).subscribe(() => {
      console.log('Rol actualizado correctamente');
      this.cargarRoles();
    }, error => {
      console.error('Error al actualizar el rol:', error);
    });
  }
}
