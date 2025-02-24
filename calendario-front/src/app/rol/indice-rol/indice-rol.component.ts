import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { RolCreacionDTO, RolDTO } from '../rol';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-indice-rol',
  imports: [
    MatButtonModule, 
    RouterLink, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
    // JsonPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indice-rol.component.html',
  styleUrl: './indice-rol.component.css'
})
export class IndiceRolComponent implements AfterViewInit, OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.http.get<RolCreacionDTO[]>('http://localhost/calendario-back/src/models/rol.php').subscribe(data => {
      this.fuenteDatos.data = data;
    });
  }

  columnasMostradas: string[] = [
    'Crear', 
    'Leer', 
    'Actualizar', 
    'Borrar', 
    'Actividad', 
    'Subactividad', 
    'Calendario', 
    'Sistema', 
    'Nombre'];
    
  fuenteDatos = new MatTableDataSource<RolCreacionDTO>(DATOS_PRUEBA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngAfterViewInit() {
    this.fuenteDatos.paginator = this.paginator;
  }

  // Para editar el formulario de Rol
  @Input()
  modeloRol?: RolDTO;

  // Enviar los datos hacia el componente padre
  @Output()
  posteoFormulario = new EventEmitter<RolCreacionDTO>()

  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    nombre: [''],
    // Por defecto, sin permiso (0)
    crear: [0], 
    leer: [0], 
    actualizar: [0], 
    borrar: [0], 
    actividad: [0], 
    subactividad: [0], 
    calendario: [0], 
    sistema: [0], 
  })

  cambioCheckbox(rol: RolCreacionDTO, permiso: string, event: any) {
    console.log(rol)
    console.log(permiso)
    console.log(event.checked)
    rol[permiso] = event.checked ? 1 : 0;
  }

  guardarCambios(){
    if(!this.form.valid){
      return;
    }

    // Enviar los datos hacia el componente padre
    const usuario = this.form.value as RolCreacionDTO;
    this.posteoFormulario.emit(usuario)
  }
}

const DATOS_PRUEBA: RolCreacionDTO[] = [
  { nombre: 'Admin', crear: 0, leer: 0, actualizar: 0, borrar: 0, actividad: 0, subactividad: 0, calendario: 0, sistema: 0 },
  { nombre: 'Financiero', crear: 0, leer: 0, actualizar: 0, borrar: 0, actividad: 0, subactividad: 0, calendario: 0, sistema: 0 },
  { nombre: 'Academico', crear: 0, leer: 0, actualizar: 0, borrar: 0, actividad: 0, subactividad: 0, calendario: 0, sistema: 0 },
  { nombre: 'Grados', crear: 0, leer: 0, actualizar: 0, borrar: 0, actividad: 0, subactividad: 0, calendario: 0, sistema: 0 }
];
