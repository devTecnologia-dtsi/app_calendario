import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UsuarioCreacionDTO, UsuarioDTO, PermisoUsuario } from '../usuario';
import { Rectoria, RectoriaService } from '../../compartidos/servicios/rectoria.service';
import { SedeDTO, SedeService } from '../../compartidos/servicios/sede.service';
import { RolDTO } from '../../rol/rol';
import { RolService } from '../../compartidos/servicios/rol.service';
import { MatCardModule } from "@angular/material/card";
import { Router } from '@angular/router';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';

@Component({
  selector: 'app-formulario-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.css']
})
export class FormularioUsuariosComponent implements OnInit {
  @Input() modelo?: UsuarioDTO;
  @Output() posteoFormulario = new EventEmitter<UsuarioCreacionDTO>();

  private fb = inject(FormBuilder);
  private rectoriaService = inject(RectoriaService);
  private usuarioService = inject(UsuarioService);
  private sedeService = inject(SedeService);
  private rolService = inject(RolService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);

  rectorias: Rectoria[] = [];
  roles: RolDTO[] = [];
  sedesPorPermiso: SedeDTO[][] = [];

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    estado: [1],
    permisos: this.fb.array<FormGroup>([])
  });

  ngOnInit(): void {
    this.cargarCatalogos();

    if (this.modelo) {
      this.form.patchValue({
        correo: this.modelo.correo,
        estado: this.modelo.estado
      });
      
      (this.modelo.permisos ?? []).forEach((p, index) => {
        // console.log('Cargando permiso existente:', p);
        this.permisos.push(this.crearPermisoForm({
          id_permiso: p.id_permiso ?? p.id_permiso,
          id_rectoria: p.id_rectoria,
          id_sede: p.id_sede,
          id_rol: p.id_rol
        }));
        this.cargarSedes(p.id_rectoria, index);
      });
    }
  }

  get permisos(): FormArray {
    return this.form.get('permisos') as FormArray;
  }

  crearPermisoForm(permiso?: PermisoUsuario): FormGroup {
    return this.fb.group({
      id_permiso: [permiso?.id_permiso ?? null],
      id_rectoria: [permiso?.id_rectoria ?? null, Validators.required],
      id_sede: [permiso?.id_sede ?? null, Validators.required],
      id_rol: [permiso?.id_rol ?? null, Validators.required]
    });
  }

  agregarPermiso() {
    this.permisos.push(this.crearPermisoForm());
    this.sedesPorPermiso.push([]); // Inicializar lista de sedes vacía
  }

  desactivarPermiso(index: number) {
    const permiso = this.permisos.at(index).value;

    if (!permiso.id_permiso) {
      this.permisos.removeAt(index);
      this.notificacionService.mostrarInfo('Permiso eliminado del formulario (aún no guardado)');
      return;
    }

    this.notificacionService.mostrarConfirmacion(`¿Seguro que deseas desactivar este permiso (ID ${permiso.id_permiso})?`).then((confirmado: boolean) =>
    {
      if (confirmado) {
        this.usuarioService.desactivarPermiso(permiso.id_permiso).subscribe({
          next: (res) => {
            if (res.status === 1) {
              this.notificacionService.mostrarExito(res.message || 'Permiso desactivado correctamente');
              this.permisos.removeAt(index);
            } else {
              this.notificacionService.mostrarAdvertencia(res.message || 'No se pudo desactivar el permiso');
            }
          },
          error: () => {
            this.notificacionService.mostrarError('Error al desactivar el permiso');
          }
        });
      } else {
        this.notificacionService.mostrarInfo('Operación cancelada');
      }
    });
  }

  private cargarCatalogos() {
    this.rectoriaService.listarRectorias().subscribe({
      next: r => this.rectorias = r.data ?? [],
      error: () => console.error('Error cargando rectorías')
    });

    this.rolService.listarRoles().subscribe({
      next: r => this.roles = r.data ?? [],
      error: () => console.error('Error cargando roles')
    });
  }

  // Cargar sedes al seleccionar rectoría
  cargarSedes(idRectoria: number, index: number) {
    if (!idRectoria) {
      this.sedesPorPermiso[index] = [];
      this.permisos.at(index).get('id_sede')?.reset();
      return;
    }

    this.sedeService.listarSedesPorRectoria(idRectoria).subscribe({
      next: (resp) => {
        this.sedesPorPermiso[index] = resp.data ?? [];
        // Si la sede seleccionada ya no pertenece a esa rectoría se limpia
        const idSedeActual = this.permisos.at(index).get('id_sede')?.value;
        if (!this.sedesPorPermiso[index].some(s => s.id === idSedeActual)) {
          this.permisos.at(index).get('id_sede')?.reset();
        }
      },
      error: () => {
        console.error('Error cargando sedes');
        this.sedesPorPermiso[index] = [];
      }
    });
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }

  guardarCambios() {
    if (this.form.invalid) return;
    const usuario: UsuarioCreacionDTO = this.form.value as UsuarioCreacionDTO;
    this.posteoFormulario.emit(usuario);
  }

  // guardarCambios() {
  //   if (this.form.invalid) {
  //     console.warn('Formulario inválido:', this.form.errors);
  //     console.table(this.form.value);
  //     return;
  //   }

  //   const usuario: UsuarioCreacionDTO = this.form.value as UsuarioCreacionDTO;

  //   // Mostrar todo el formulario
  //   // console.log('Form completo:', this.form.value);

  //   // Mostrar detalles por secciones
  //   // console.log('Correo:', usuario.correo);
  //   // console.log('Estado:', usuario.estado);

  //   // Ver cada permiso con más claridad
  //   if (usuario.permisos && usuario.permisos.length > 0) {
  //     console.group('Permisos del usuario');
  //     usuario.permisos.forEach((p, i) => {
  //       // console.log(`Permiso ${i + 1}:`, {
  //       //   id_permiso: p.id_permiso,
  //       //   rectoria: p.id_rectoria,
  //       //   sede: p.id_sede,
  //       //   rol: p.id_rol
  //       // });
  //     });
  //     console.groupEnd();
  //   } else {
  //     // console.log('No hay permisos cargados');
  //   }

  //   // Emitimos al componente padre
  //   // console.info('Enviando usuario al componente padre...');
  //   this.posteoFormulario.emit(usuario);
  // }
}
