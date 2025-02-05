import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-formulario-usuarios',
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './formulario-usuarios.component.html',
  styleUrl: './formulario-usuarios.component.css'
})
export class FormularioUsuariosComponent implements OnInit {
  ngOnInit(): void {
    if (this.modelo !== undefined){
      this.form.patchValue(this.modelo);
    }
  }

  // Para editar el formulario de usaurios
  @Input()
  modelo?: UsuarioDTO;


  // Enviar los datos hacia el componente padre
  @Output()
  posteoFormulario = new EventEmitter<UsuarioCreacionDTO>();

  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    correo: ['', {validators: [Validators.email, Validators.required]}],
    estado: 1,
    id_rectoria: [null as number | null], 
    id_sede: [null as number | null],    
    fecha_ingreso: new FormControl<Date | null>(null),
    fecha_creacion: new Date(),
    id_rol: [null as number | null]
  })

  obtenerErrorCampoCorreo(): string {
    let correo = this.form.controls.correo;

    if(correo.hasError('email')){
      return "Debe ingresar una dirección de correo valida en el campo Correo";
    }
    
    if(correo.hasError('required')) {
      return "El campo Correo es requerido";
    }

    return "";
  }

  guardarCambios(){
    if(!this.form.valid){

      return;

    }

    // Enviar los datos hacia el componente padre
    const usuario = this.form.value as UsuarioCreacionDTO;
    this.posteoFormulario.emit(usuario)
  }

}
