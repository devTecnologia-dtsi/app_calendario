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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-indice-rol',
  standalone: true,
  imports: [
    CommonModule,
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
    HttpClientModule,
    // JsonPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indice-rol.component.html',
  styleUrls: ['./indice-rol.component.css']
})
export class IndiceRolComponent implements AfterViewInit, OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.http.get<RolCreacionDTO[]>('http://localhost/calendario-back/src/models/rol.php').subscribe(data => {
      console.log(data); // Verifica los datos recibidos
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
    
  fuenteDatos = new MatTableDataSource<RolCreacionDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngAfterViewInit() {
    this.fuenteDatos.paginator = this.paginator;
  }

  @Input()
  modeloRol?: RolDTO;

  @Output()
  posteoFormulario = new EventEmitter<RolCreacionDTO>()

  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    nombre: [''],
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
    rol[permiso] = event.checked ? 1 : 0;
  }

  guardarCambios(){
    if(!this.form.valid){
      return;
    }

    const usuario = this.form.value as RolCreacionDTO;
    this.posteoFormulario.emit(usuario)
  }
}
