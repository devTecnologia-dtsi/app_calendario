import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Modelos y servicios
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { Rectoria, RectoriaService } from '../../compartidos/servicios/rectoria.service';
import { Sede, SedeService } from '../../compartidos/servicios/sede.service';
import { RolDTO } from '../../rol/rol';
import { RolService } from '../../compartidos/servicios/rol.service';

// Función para validar el dominio del correo
export function dominioCorreoValidador(dominio: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const correo_nuevo = control.value;
    if (!correo_nuevo) return null;

    const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@${dominio}$`);
    return regex.test(correo_nuevo) ? null : { dominioInvalido: true };
  };
}

@Component({
  selector: 'app-formulario-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.css']
})

export class FormularioUsuariosComponent implements OnInit {

  // Inputs y Outputs
  @Input() modelo?: UsuarioDTO;
  @Output() posteoFormulario = new EventEmitter<UsuarioCreacionDTO>();

  // Inyección de dependencias
  private formbuilder = inject(FormBuilder);
  private rectoriaService = inject(RectoriaService);
  private sedeService = inject(SedeService);
  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);

  // Formularios y listas de datos
  form = this.formbuilder.group({
    correo_nuevo: ['', [Validators.email, Validators.required, dominioCorreoValidador('uniminuto.edu')]],
    estado: 1,
    id_rol: [null as number | null, Validators.required],
    id_rectoria: [null as number | null, Validators.required],
    id_sede: [null as number | null, Validators.required],
  });

  rectorias: Rectoria[] = [];
  sedes: Sede[] = [];
  roles: RolDTO[] = [];

  // Inicialización
  ngOnInit(): void {
    this.cargarRectorias();
    this.cargarRoles();

    // Cargar sedes cuando cambie la rectoría seleccionada
    this.form.get('id_rectoria')?.valueChanges.subscribe(idRectoria => {
      this.sedes = [];
      if (idRectoria != null) {
        this.cargarSedesPorRectoria(idRectoria);
      }
    });

    // Si hay un modelo cargado, llenamos el formulario con sus valores
    // if (this.modelo) {
    //   this.form.patchValue(this.modelo);
    //   if (this.modelo.id_rectoria) {
    //     this.cargarSedesPorRectoria(this.modelo.id_rectoria);
    //   }
    // }

    if (this.modelo) {
      this.form.patchValue(this.modelo);
    }
  }

  // Métodos de carga de datos
  cargarRectorias() {
    this.rectoriaService.listarRectorias().subscribe({
      next: (data) => {
        console.log('Rectorías cargadas:', data);  // ✅ Confirma que es un array
        this.rectorias = Array.isArray(data) ? data : [];
      },
      error: () => console.error('Error al cargar las rectorías')
    });
  }
  
  
  
  // cargarRectorias() {
  //   this.rectoriaService.listarRectorias().subscribe(data => {
  //     this.rectorias = data;
  //     if (this.modelo) this.form.patchValue({ id_rectoria: this.modelo.id_rectoria });
  //   });
  //   error: () => console.error('Error al cargar las rectorías')
  // }

  cargarSedesPorRectoria(id: number) {
    this.sedeService.listarSedesPorRectoria(id).subscribe({
      next: (data) => {
        this.sedes = data;
        if (this.modelo) this.form.patchValue({ id_sede: this.modelo.id_sede });
      },
      error: () => console.error(`Error al cargar las sedes para la rectoría ID: ${id}`)
    });
  }

  // cargarSedesPorRectoria(id: number) {
  //   this.sedeService.listarSedesPorRectoria(id).subscribe(data => {
  //     this.sedes = data;
  //     if (this.modelo) this.form.patchValue({ id_sede: this.modelo.id_sede });
  //   });
  // }

  cargarRoles() {
    this.rolService.listarRoles().subscribe({
      next: (data) => {
        this.roles = data;
        if (this.modelo) this.form.patchValue({ id_rol: this.modelo.id_rol });
      },
      error: () => console.error('Error al cargar los roles')
    });
  }

  // cargarRoles() {
  //   this.rolService.listarRoles().subscribe(data => {
  //     this.roles = data;
  //     if (this.modelo) this.form.patchValue({ id_rol: this.modelo.id_rol });
  //   });
  // }

  // Manejo de errores en los campos
  // obtenerError(control: AbstractControl | null, mensaje: string): string {
  //   return control?.hasError('required') ? mensaje : '';
  // }

  obtenerFaltaSeleccionRectoria(): string {
    return this.form.controls.id_rectoria.hasError('required')
      ? "Debe seleccionar primero la Rectoría"
      : "";
  }

  obtenerErrorCampoCorreo(): string {
    const correo = this.form.controls.correo_nuevo;
    if (correo.hasError('email')) return "Debe ingresar una dirección de correo válida";
    if (correo.hasError('required')) return "El campo Correo es requerido";
    if (correo.hasError('dominioInvalido')) return "El correo debe ser del dominio @uniminuto.edu";
    return "";
  }

  obtenerErrorSelectRol(): string {
    return this.form.controls.id_rol.hasError('required')
      ? "Debe seleccionar algún valor del campo Rol"
      : "";
  }

  obtenerErrorSelectRectoria(): string {
    return this.form.controls.id_rectoria.hasError('required')
      ? "Debe seleccionar algún valor del campo Rectoria"
      : "";
  }

  obtenerErrorSelectSede(): string {
    return this.form.controls.id_sede.hasError('required')
      ? "Debe seleccionar algún valor del campo Sede"
      : "";
  }

  // Guardar cambios
  guardarCambios() {
    if (!this.form.valid) return;
    const usuario = this.form.value as UsuarioCreacionDTO;
    this.posteoFormulario.emit(usuario);
  }
}
