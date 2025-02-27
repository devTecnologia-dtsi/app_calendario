import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Rectoria, RectoriaService } from '../../compartidos/servicios/rectoria.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Sede, SedeService } from '../../compartidos/servicios/sede.service';

@Component({
  selector: 'app-formulario-usuarios',
  standalone: true,
  imports: [
    MatButtonModule, 
    RouterLink, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.css']
})
export class FormularioUsuariosComponent implements OnInit {
  ngOnInit(): void {
    if (this.modelo !== undefined){
      this.form.patchValue(this.modelo);
    }
    this.cargarRectorias();
  }

  @Input()
  modelo?: UsuarioDTO;

  @Output()
  posteoFormulario = new EventEmitter<UsuarioCreacionDTO>();

  private formbuilder = inject(FormBuilder);
  private rectoriaService = inject(RectoriaService);
  private sedeService = inject(SedeService);

  form = this.formbuilder.group({
    correo: ['', {validators: [Validators.email, Validators.required]}],
    estado: 1,
    id_rol: [null as number | null, {validators: [Validators.required]}],
    id_rectoria: [null as number | null, {validators: [Validators.required]}], 
    id_sede: [null as number | null, {validators: [Validators.required]}],    
    fecha_ingreso: new Date(),
    fecha_creacion: new Date(),
  })

  rectorias: Rectoria[] = [];
  sedes: Sede[] = [];

  cargarRectorias() {
    this.rectoriaService.listarRectorias().subscribe(data => {
      this.rectorias = data;
    });
  }

  cargarSedesPorRectoria(id: number){
    this.sedeService.listarSedesPorRectoria(id).subscribe(data => {
      this.sedes = data;
    });
  }

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

  obtenerErrorSelectRol(): string {
    let rol = this.form.controls.id_rol;

    if(rol.hasError('required')){
      return "Debe seleccionar algún valor del campo Rol";
    }

    return "";
  }

  obtenerErrorSelectRectoria(): string{
    let rectoria = this.form.controls.id_rectoria;

    if(rectoria.hasError('required')){
      return "Debe seleccionar algún valor del campo Rectoria";
    }
    return "";
  }

  obtenerErrorSelectSede(): string{
    let sede = this.form.controls.id_sede;

    if(sede.hasError('required')){
      return "Debe seleccionar algún valor del campo Sede";
    }
    return "";
  }

  guardarCambios(){
    if(!this.form.valid){
      return;
    }

    const usuario = this.form.value as UsuarioCreacionDTO;
    this.posteoFormulario.emit(usuario)
  }
}
