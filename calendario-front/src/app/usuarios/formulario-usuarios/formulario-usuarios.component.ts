import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { Rectoria, RectoriaService } from '../../compartidos/servicios/rectoria.service';
import { Sede, SedeService } from '../../compartidos/servicios/sede.service';
import { RolService } from '../../compartidos/servicios/rol.service';
import { RolDTO } from '../../rol/rol';

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
    CommonModule,
    
  ],
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.css']
})
export class FormularioUsuariosComponent implements OnInit {
  ngOnInit(): void {
    this.cargarRectorias();
    this.cargarRoles();
    this.form.get('id_rectoria')?.valueChanges.subscribe(idRectoria => {
      if (idRectoria != null) {
        this.cargarSedesPorRectoria(idRectoria);
      }
    });

    if (this.modelo !== undefined){
      console.log('Datos del modelo recibidos en FormularioUsuariosComponent:', this.modelo);
      this.form.patchValue(this.modelo);
    }


  }

  @Input()
  modelo?: UsuarioDTO;

  @Output()
  posteoFormulario = new EventEmitter<UsuarioCreacionDTO>();

  private formbuilder = inject(FormBuilder);
  private rectoriaService = inject(RectoriaService);
  private sedeService = inject(SedeService);
  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);

  form = this.formbuilder.group({
    correo: ['', {validators: [Validators.email, Validators.required]}],
    estado: 1,
    id_rol: [null as number | null, {validators: [Validators.required]}],
    id_rectoria: [null as number | null, {validators: [Validators.required]}], 
    id_sede: [null as number | null, {validators: [Validators.required]}],    
  })

  rectorias: Rectoria[] = [];
  sedes: Sede[] = [];
  roles: RolDTO[] = [];

  cargarRectorias() {
    this.rectoriaService.listarRectorias().subscribe(data => {
      this.rectorias = data;

      console.log('Rectorías cargadas:', this.rectorias);
      console.log('ID de Rectoría en el modelo:', this.modelo?.id_rectoria);

      if (this.modelo) {
        this.form.patchValue({ id_rectoria: this.modelo.id_rectoria });
      }

      // if (this.modelo && this.modelo.id_rectoria !== undefined) {
      //   this.form.patchValue({ id_rectoria: this.modelo.id_rectoria });
      // } else {
      //   console.warn("this.modelo no tiene un id_rectoria válido:", this.modelo);
      // }
      
    });
  }

  cargarSedesPorRectoria(id: number){
    this.sedeService.listarSedesPorRectoria(id).subscribe(data => {
      this.sedes = data;

      console.log('Sedes cargadas:', this.sedes);
      console.log('ID de Sede en el modelo:', this.modelo?.id_sede);

      if (this.modelo) {
        this.form.patchValue({ id_sede: this.modelo.id_sede });
      }
    });
  }

  cargarRoles(){
    this.rolService.listarRoles().subscribe(data => {
      this.roles = data;

      console.log('Roles cargados:', this.roles);
      console.log('ID de Rol en el modelo:', this.modelo?.id_rol);

      if (this.modelo) {
        this.form.patchValue({ id_rol: this.modelo.id_rol });
      }
    });
  }
  
  obtenerFaltaSeleccionRectoria(): string {
    let rectoria = this.form.controls.id_rectoria;

    if(rectoria.hasError('required')){
      return "Debe seleccionar primero la Rectoría";
    }
    return "";
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
    console.log('Datos del formulario:', usuario);
    this.posteoFormulario.emit(usuario);
  }
}
