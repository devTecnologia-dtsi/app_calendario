import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { SedeCreacionDTO, SedeDTO } from '../sede';

@Component({
  selector: 'app-formulario-sede',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './formulario-sede.component.html',
  styleUrl: './formulario-sede.component.css'
})
export class FormularioSedeComponent implements OnInit{
  ngOnInit(): void {
    if (this.modelo !== undefined){
      this.form.patchValue(this.modelo);
    }
  }

  //Colocar el valor a editar en el formulario
  @Input()
  modelo?: SedeDTO;


  //Enviar hacia el documento padre, los valores del formulario
  @Output()
  posteoFormulario = new EventEmitter<SedeCreacionDTO>();


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
    if(!this.form.valid){
      return;
    }
    //Enviar hacia el documento padre, los valores del formulario
    const sede = this.form.value as SedeCreacionDTO;
    this.posteoFormulario.emit(sede);
  }

}

