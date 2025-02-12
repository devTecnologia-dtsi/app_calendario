import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { RolCreacionDTO, RolDTO } from '../rol';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

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
    MatPaginatorModule
  ],
  templateUrl: './indice-rol.component.html',
  styleUrl: './indice-rol.component.css'
})
export class IndiceRolComponent implements OnInit {
  ngOnInit(): void {
    if (this.modeloRol !== undefined){
      this.form.patchValue(this.modeloRol);
    }
  }

  // Para editar el formulario de Rol
  @Input()
  modeloRol?: RolDTO;

  // Enviar los datos hacia el componente padre
  @Output()
  posteoFormulario = new EventEmitter<RolCreacionDTO>()

  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    crear: [null as number | null],
    leer: [null as number | null],
    actualizar: [null as number | null],
    borrar: [null as number | null],
    actividad: [null as number | null],
    subactividad: [null as number | null],
    calendario: [null as number | null],
    sistema: [null as number | null],
    nombre: ['']
  })

  guardarCambios(){
    if(!this.form.valid){
      return;
    }

    // Enviar los datos hacia el componente padre
    const usuario = this.form.value as RolCreacionDTO;
    this.posteoFormulario.emit(usuario)
  }

}
