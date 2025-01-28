import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-crear-sede',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './crear-sede.component.html',
  styleUrl: './crear-sede.component.css'
})
export class CrearSedeComponent {

  private router = inject (Router);

  //Formulario reactivo
  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    codigo: ['', {validators: [Validators.required]}],
    nombre: ['', {validators: [Validators.required]}],
    id_rectoria: ['', {validators: [Validators.required]}]
  })

  obtenerErrorCampoCodigo(): string {
    let codigo = this.form.controls.codigo;

    if(codigo.hasError('required')){
      return "El campo Código sede es requerido";
    }
    return '';
  }

  obtenerErrorCampoNombre(){
    let nombre = this.form.controls.nombre;

    if(nombre.hasError('required')){
      return "El campo Nombre sede es requerido";
    }
    return '';
  }

  obtenerErrorCampoRectoria(){
    let id_rectoria = this.form.controls.id_rectoria;

    if(id_rectoria.hasError('required')){
      return "El campo Rectoría es requerido";
    }
    return '';
  }

  guardarCambios(){
    //..guardar cambios

    //Para que despues de que guarde redirija al formulario de sedes.
    //this.router.navigate(['/sedes'])
    console.log(this.form.value);
  }
}
