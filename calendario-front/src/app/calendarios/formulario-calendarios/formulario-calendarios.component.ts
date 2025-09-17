// import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CalendarioCreacionDTO, ActividadCreacionDTO } from '../calendarios';
// import { RectoriaService } from '../../compartidos/servicios/rectoria.service';
// import { SedeService } from '../../compartidos/servicios/sede.service';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatInputModule } from '@angular/material/input';
// import { ModalidadesService } from '../../compartidos/servicios/modalidades.service';
// import { PeriodosService } from '../../compartidos/servicios/periodos.service';
// import { TipoCalendariosService } from '../../compartidos/servicios/tipo-calendarios.service';
// import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
// import { ActividadService } from '../../compartidos/servicios/actividad.service';
// import moment from 'moment';
// import { SubactividadesService } from '../../compartidos/servicios/subactividades.service';
// import { TiposPeriodoService } from '../../compartidos/servicios/tipos-periodo.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
// import { fechaFinPosteriorValidator, fechaNoPasadaValidator} from '../../compartidos/funciones/validaciones';
// import { AuthService } from '../../seguridad/auth.service';

// @Component({
//   selector: 'app-formulario-calendarios',
//   templateUrl: './formulario-calendarios.component.html',
//   styleUrls: ['./formulario-calendarios.component.css'],
//   standalone: true,
//   imports: [
//     MatCardModule,
//     MatIconModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatButtonModule,
//     MatSelectModule,
//     CommonModule,
//     MatNativeDateModule
//   ]
// })
// export class FormularioCalendariosComponent implements OnInit {
//   @Input() modelo?: CalendarioCreacionDTO;
//   @Output() posteoFormulario = new EventEmitter<CalendarioCreacionDTO>();

//   form: FormGroup;
//   rectorias: any[] = [];
//   sedes: any[] = [];
//   modalidades: any[] = [];
//   periodos: any[] = [];
//   tiposPeriodo: any[] = [];
//   tiposCalendario: any[] = [];
//   tituloFormulario: string = '';

//   private fb = inject(FormBuilder);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private notificacion = inject(NotificacionService);
//   private rectoriaService = inject(RectoriaService);
//   private sedeService = inject(SedeService);
//   private modalidadService = inject(ModalidadesService);
//   private periodoService = inject(PeriodosService);
//   private tipoCalendarioService = inject(TipoCalendariosService);
//   private tiposPeriodoService = inject(TiposPeriodoService);
//   private calendariosService = inject(CalendariosService);
//   private actividadService = inject(ActividadService);
//   private subactividadService = inject(SubactividadesService);
//   private authService = inject(AuthService);

//   constructor() {
//     this.form = this.fb.group({
//       id_rectoria: [null, Validators.required],
//       id_sede: [null, Validators.required],
//       id_tipo_calendario: [null, Validators.required],
//       id_modalidad: [null, Validators.required],
//       id_tipo_periodo: [null, Validators.required],
//       id_periodo_academico: [null, Validators.required],
//       estado: [1],
//       in_sede: [1],
//       actividades: this.fb.array([])
//     });
//   }

//   ngOnInit(): void {
//     const tipoCalendarioParam = this.route.snapshot.paramMap.get('tipo') ?? '';

//     const tiposMap: Record<string, number> = {
//       academico: 1,
//       financiero: 2,
//       grados: 3
//     };

//     const tiposTexto: Record<string, string> = {
//       academico: 'académico',
//       financiero: 'financiero',
//       grados: 'grados'
//     };

//     const idTipo = tiposMap[tipoCalendarioParam];
//     if (idTipo) {
//       this.form.patchValue({ id_tipo_calendario: idTipo });
//       this.tituloFormulario = this.modelo
//         ? `Editar calendario ${tiposTexto[tipoCalendarioParam]}`
//         : `Crear calendario ${tiposTexto[tipoCalendarioParam]}`;
//     }

//     this.cargarRectorias();
//     this.cargarSedes();
//     this.cargarModalidades();
//     this.cargarPeriodos();
//     this.cargarTiposCalendario();
//     this.cargarTiposPeriodo();

//     if (this.modelo) {
//       this.form.patchValue(this.modelo);
//       this.modelo.actividades?.forEach((actividad) => {
//         const actividadForm = this.fb.group({
//           id: [actividad.id],
//           id_calendario: [actividad.id_calendario],
//           titulo: [actividad.titulo, Validators.required],
//           estado: [actividad.estado],
//           subactividades: this.fb.array([])
//         });

//         actividad.subactividades?.forEach((sub) => {
//           const subForm = this.fb.group({
//             id: [sub.id],
//             nombre: [sub.nombre, Validators.required],
//             descripcion: [sub.descripcion],
//             fecha_inicio: [sub.fecha_inicio ? new Date(sub.fecha_inicio) : null],
//             fecha_fin: [sub.fecha_fin ? new Date(sub.fecha_fin) : null],
//             estado: [sub.estado]
//           });
//           (actividadForm.get('subactividades') as FormArray).push(subForm);
//         });

//         this.actividades.push(actividadForm);
//       });
//     }
//   }

//   get actividades(): FormArray {
//     return this.form.get('actividades') as FormArray;
//   }

//   getSubactividades(index: number): FormArray {
//     return this.actividades.at(index).get('subactividades') as FormArray;
//   }

//   agregarActividad(actividad?: ActividadCreacionDTO): void {
//     const actividadForm = this.fb.group({
//       id_calendario: [actividad?.id_calendario || null],
//       titulo: [actividad?.titulo || '', Validators.required],
//       estado: [1],
//       subactividades: this.fb.array([])
//     });
//     this.actividades.push(actividadForm);
//   }

//   // Eliminar o desactivar actividad
//   async eliminarActividad(index: number): Promise<void> {
//     const actividad = this.actividades.at(index).value;

//     const confirmacion = await this.notificacion.mostrarConfirmacion(
//       '¿Seguro que quieres eliminar esta actividad?',
//       'Confirmar eliminación'
//     );

//     if (!confirmacion) return;

//     // Si tiene ID, desactiva del backend
//     if (actividad.id) {
//       this.actividadService.desactivarActividad(actividad.id).subscribe({
//         next: (respuesta) => {
//           if (respuesta.status === 1) {
//             this.notificacion.mostrarExito(respuesta.message || 'Actividad desactivada correctamente');
//           } else {
//             this.notificacion.mostrarError(respuesta.message || 'No se pudo desactivar la actividad');
//             return;
//           }
//           this.actividades.removeAt(index); // Siempre se remueve del formulario
//         },
//         error: () => this.notificacion.mostrarError('Error al desactivar la actividad')
//       });
//     } else {
//       // Si no tiene ID (es nueva), solo la eliminamos del formulario
//       this.actividades.removeAt(index);
//     }
//   }

//   agregarSubactividad(index: number, sub?: any): void {
//     const subactividadForm = this.fb.group({
//       nombre: [sub?.nombre || '', Validators.required],
//       descripcion: [sub?.descripcion || ''],
//       fecha_inicio: [sub?.fecha_inicio || null, [fechaNoPasadaValidator]],
//       fecha_fin: [sub?.fecha_fin || null, [fechaNoPasadaValidator, fechaFinPosteriorValidator('fecha_inicio')]],
//       estado: [1]
//     });
//     this.getSubactividades(index).push(subactividadForm);
//   }

//   // Eliminar o desactivar subactividad
//   async eliminarSubactividad(indexActividad: number, indexSub: number): Promise<void> {
//     const subactividad = this.getSubactividades(indexActividad).at(indexSub).value;

//     const confirmacion = await this.notificacion.mostrarConfirmacion(
//       '¿Seguro que quieres eliminar esta subactividad?',
//       'Confirmar eliminación'
//     );

//     if (!confirmacion) return;

//     // Si tiene ID, desactiva del backend
//     if (subactividad.id) {
//       this.subactividadService.desactivarSubactividad(subactividad.id).subscribe({
//         next: (respuesta) => {
//           if (respuesta.status === 1) {
//             this.notificacion.mostrarExito(respuesta.message || 'Subactividad desactivada correctamente');
//           } else {
//             this.notificacion.mostrarError(respuesta.message || 'No se pudo desactivar la subactividad');
//             return;
//           }
//           this.getSubactividades(indexActividad).removeAt(indexSub); // Siempre se remueve
//         },
//         error: () => this.notificacion.mostrarError('Error al desactivar la subactividad')
//       });
//     } else {
//       // Si no tiene ID (es nueva), solo la eliminamos del formulario
//       this.getSubactividades(indexActividad).removeAt(indexSub);
//     }
//   }

//   cargarRectorias() {
//     this.rectoriaService.listarRectoriasPorUsuario().subscribe({
//       next: (r) => (this.rectorias = r.data),
//       error: () => this.notificacion.mostrarError('Error al cargar rectorías')
//     });
//   }

//   cargarSedes() {
//     this.sedeService.listarSedesPorUsuario().subscribe({
//       next: (r) => (this.sedes = r.data),
//       error: () => this.notificacion.mostrarError('Error al cargar sedes')
//     });
//   }

//   cargarModalidades() {
//     this.modalidadService.listarModalidades().subscribe({
//       next: (r) => (this.modalidades = r.data),
//       error: () => this.notificacion.mostrarError('Error al cargar modalidades')
//     });
//   }

//   cargarTiposPeriodo() {
//     this.tiposPeriodoService.listarTiposPeriodo().subscribe({
//       next: (r) => (this.tiposPeriodo = r.data),
//       error: () => this.notificacion.mostrarError('Error al cargar tipos de periodo')
//     });
//   }

//   cargarPeriodos() {
//     this.periodoService.listarPeriodos().subscribe({
//       next: (r) => (this.periodos = r.data),
//       error: () => this.notificacion.mostrarError('Error al cargar periodos')
//     });
//   }

//   cargarTiposCalendario() {
//     this.tipoCalendarioService.listarTiposCalendarios().subscribe({
//       next: (r) => (this.tiposCalendario = r.data),
//       error: () => this.notificacion.mostrarError('Error al cargar tipos de calendario')
//     });
//   }

//   guardar(): void {
//     if (this.form.invalid) {
//       // console.error('Formulario inválido', this.form.errors);
//       return;
//     }

//     const idUsuario = this.authService.getIdUsuario();
//     if (!idUsuario) {
//       this.notificacion.mostrarError('No se pudo obtener el ID del usuario');
//       return;
//     }

//     const calendario: any = {
//       id_usuario: idUsuario,
//       id_rectoria: this.form.value.id_rectoria,
//       id_sede: this.form.value.id_sede,
//       id_tipo_calendario: this.form.value.id_tipo_calendario,
//       id_modalidad: this.form.value.id_modalidad,
//       id_periodo_academico: this.form.value.id_periodo_academico,
//       id_tipo_periodo: this.form.value.id_tipo_periodo,
//       estado: this.form.value.estado,
//       en_sede: this.form.value.in_sede,
//       actividades: this.form.value.actividades?.map((act: any) => ({
//         id: act.id,
//         titulo: act.titulo,
//         estado: act.estado,
//         subactividades: act.subactividades?.map((sub: any) => ({
//           id: sub.id,
//           nombre: sub.nombre,
//           descripcion: sub.descripcion,
//           fecha_inicio: sub.fecha_inicio ? moment(sub.fecha_inicio).format('YYYY-MM-DD') : null,
//           fecha_fin: sub.fecha_fin ? moment(sub.fecha_fin).format('YYYY-MM-DD') : null,
//           estado: sub.estado
//         }))
//       }))
//     };

//     this.enviarDatos(calendario);
//   }

//   private enviarDatos(calendario: any): void {
//     const idCalendario = this.route.snapshot.paramMap.get('id');

//     if (idCalendario) {
//       this.calendariosService.actualizarCalendario(Number(idCalendario), calendario).subscribe({
//         next: () => {
//           this.notificacion.mostrarExito('Calendario actualizado correctamente');
//           this.router.navigate(['/dashboard']);
//         },
//         error: () => {
//           this.notificacion.mostrarError('Error al actualizar el calendario');
//         }
//       });
//     } else {
//       this.calendariosService.crearCalendario(calendario).subscribe({
//         next: () => {
//           this.notificacion.mostrarExito('Calendario creado correctamente');
//           this.router.navigate(['/dashboard']);
//         },
//         error: () => {
//           this.notificacion.mostrarError('Error al crear el calendario');
//         }
//       });
//     }
//   }

//   cancelar() {
//     this.router.navigate(['/dashboard']);
//   }
// }

import { Component, OnInit, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { CdkTableModule } from '@angular/cdk/table';
import { forkJoin } from 'rxjs';
import moment from 'moment';

import { CalendarioCreacionDTO, ActividadCreacionDTO } from '../calendarios';
import { RectoriaService } from '../../compartidos/servicios/rectoria.service';
import { SedeService } from '../../compartidos/servicios/sede.service';
import { ModalidadesService } from '../../compartidos/servicios/modalidades.service';
import { PeriodosService } from '../../compartidos/servicios/periodos.service';
import { TipoCalendariosService } from '../../compartidos/servicios/tipo-calendarios.service';
import { TiposPeriodoService } from '../../compartidos/servicios/tipos-periodo.service';
import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
import { ActividadService } from '../../compartidos/servicios/actividad.service';
import { SubactividadesService } from '../../compartidos/servicios/subactividades.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
import { AuthService } from '../../seguridad/auth.service';
import { fechaFinPosteriorValidator, fechaNoPasadaValidator, noSoloEspaciosValidator } from '../../compartidos/funciones/validaciones';

@Component({
  selector: 'app-formulario-calendarios',
  templateUrl: './formulario-calendarios.component.html',
  styleUrls: ['./formulario-calendarios.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatNativeDateModule,
    CdkTableModule
  ]
})
export class FormularioCalendariosComponent implements OnInit {

  private _modelo?: CalendarioCreacionDTO;

  @Input() set modelo(value: CalendarioCreacionDTO | undefined) {
    if (value) {
      this._modelo = value;

      // setea datos base del calendario
      this.form.patchValue({
        id_rectoria: value.id_rectoria,
        id_sede: value.id_sede,
        id_tipo_calendario: value.id_tipo_calendario,
        id_modalidad: value.id_modalidad,
        id_tipo_periodo: value.id_tipo_periodo,
        id_periodo_academico: value.id_periodo_academico,
        estado: value.estado,
        en_sede: value.en_sede
      });

      // limpia y carga actividades y subactividades
      this.actividades.clear();
      (value.actividades ?? []).forEach(a => {
        this.actividades.push(this.crearActividadForm(a));
      });

      // Título para edición
      this.tituloFormulario = 'Editar calendario';
      this.cdr.detectChanges();
    }
  }
  get modelo(): CalendarioCreacionDTO | undefined {
    return this._modelo;
  }

  @Output() posteoFormulario = new EventEmitter<CalendarioCreacionDTO>();

  form: FormGroup;
  rectorias: any[] = [];
  sedes: any[] = [];
  modalidades: any[] = [];
  periodos: any[] = [];
  tiposPeriodo: any[] = [];
  tiposCalendario: any[] = [];
  tituloFormulario: string = '';

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);
  private rectoriaService = inject(RectoriaService);
  private sedeService = inject(SedeService);
  private modalidadService = inject(ModalidadesService);
  private periodoService = inject(PeriodosService);
  private tipoCalendarioService = inject(TipoCalendariosService);
  private tiposPeriodoService = inject(TiposPeriodoService);
  private calendariosService = inject(CalendariosService);
  private actividadService = inject(ActividadService);
  private subactividadService = inject(SubactividadesService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.form = this.fb.group({
      id_rectoria: [null, Validators.required],
      id_sede: [null, Validators.required],
      id_tipo_calendario: [null, Validators.required],
      id_modalidad: [null, Validators.required],
      id_tipo_periodo: [null, Validators.required],
      id_periodo_academico: [null, Validators.required],
      estado: [1],
      en_sede: [1],
      actividades: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // solo setea el título por ruta cuando NO hay modelo (creación)
    const tipoCalendarioParam = this.route.snapshot.paramMap.get('tipo') ?? '';
    const tiposTexto: Record<string, string> = {
      academico: 'académico',
      financiero: 'financiero',
      grados: 'grados'
    };

    if (!this._modelo) {
      this.tituloFormulario = `Crear calendario ${tiposTexto[tipoCalendarioParam] ?? ''}`.trim();
    }

    this.cargarCatalogos();
  }

  // Helpers de formulario
  get actividades(): FormArray {
    return this.form.get('actividades') as FormArray;
  }
  getSubactividades(index: number): FormArray {
    return this.actividades.at(index).get('subactividades') as FormArray;
  }

  private crearActividadForm(actividad?: any): FormGroup {
    return this.fb.group({
      id: [actividad?.id],
      id_calendario: [actividad?.id_calendario ?? null],
      titulo: [ actividad?.titulo ?? '', [Validators.required, Validators.maxLength(254), noSoloEspaciosValidator()]],
      estado: [actividad?.estado ?? 1],
      subactividades: this.fb.array((actividad?.subactividades ?? []).map((sub: any) => this.crearSubactividadForm(sub))
      )
    });
  }

  private crearSubactividadForm(sub?: any): FormGroup {
    const fecha_inicio_original = sub?.fecha_inicio ? new Date(sub.fecha_inicio) : undefined;
    const fecha_fin_original = sub?.fecha_fin ? new Date(sub.fecha_fin) : undefined;

    return this.fb.group({
      id: [sub?.id],
      nombre: [ sub?.nombre ?? '', [Validators.required, Validators.maxLength(254), noSoloEspaciosValidator()]],
      descripcion: [ sub?.descripcion ?? '', [Validators.maxLength(254)]],
      // fecha_inicio: [ sub?.fecha_inicio ? new Date(sub.fecha_inicio) : null, [fechaNoPasadaValidator]],
      // fecha_fin: [ sub?.fecha_fin ? new Date(sub.fecha_fin) : null, [fechaNoPasadaValidator, fechaFinPosteriorValidator('fecha_inicio')]],
    fecha_inicio: [fecha_inicio_original ?? null,[fechaNoPasadaValidator(fecha_inicio_original)]],
    fecha_fin: [fecha_fin_original ?? null,[fechaNoPasadaValidator(fecha_fin_original), fechaFinPosteriorValidator('fecha_inicio')]],
    estado: [sub?.estado ?? 1]
    });
  }

  // Acciones
  agregarActividad(actividad?: ActividadCreacionDTO): void {
    this.actividades.push(this.crearActividadForm(actividad));
  }

  async eliminarActividad(index: number): Promise<void> {
    const actividad = this.actividades.at(index).value;
    const ok = await this.notificacion.mostrarConfirmacion('¿Seguro que quieres eliminar esta actividad?', 'Confirmar eliminación');
    if (!ok) return;

    if (actividad.id) {
      this.actividadService.desactivarActividad(actividad.id).subscribe({
        next: (r) => {
          if (r.status === 1) {
            this.notificacion.mostrarExito(r.message || 'Actividad desactivada correctamente');
            this.actividades.removeAt(index);
          } else {
            this.notificacion.mostrarError(r.message || 'No se pudo desactivar la actividad');
          }
        },
        error: () => this.notificacion.mostrarError('Error al desactivar la actividad')
      });
    } else {
      this.actividades.removeAt(index);
    }
  }

  agregarSubactividad(index: number, sub?: any): void {
    this.getSubactividades(index).push(this.crearSubactividadForm(sub));
  }

  async eliminarSubactividad(indexActividad: number, indexSub: number): Promise<void> {
    const sub = this.getSubactividades(indexActividad).at(indexSub).value;
    const ok = await this.notificacion.mostrarConfirmacion('¿Seguro que quieres eliminar esta subactividad?', 'Confirmar eliminación');
    if (!ok) return;

    if (sub.id) {
      this.subactividadService.desactivarSubactividad(sub.id).subscribe({
        next: (r) => {
          if (r.status === 1) {
            this.notificacion.mostrarExito(r.message || 'Subactividad desactivada correctamente');
            this.getSubactividades(indexActividad).removeAt(indexSub);
          } else {
            this.notificacion.mostrarError(r.message || 'No se pudo desactivar la subactividad');
          }
        },
        error: () => this.notificacion.mostrarError('Error al desactivar la subactividad')
      });
    } else {
      this.getSubactividades(indexActividad).removeAt(indexSub);
    }
  }

  // Catálogos 
  private cargarCatalogos(): void {
    forkJoin({
      rectorias: this.rectoriaService.listarRectoriasPorUsuario(),
      sedes: this.sedeService.listarSedesPorUsuario(),
      modalidades: this.modalidadService.listarModalidades(),
      periodos: this.periodoService.listarPeriodos(),
      tiposCalendario: this.tipoCalendarioService.listarTiposCalendarios(),
      tiposPeriodo: this.tiposPeriodoService.listarTiposPeriodo()
    }).subscribe({
      next: (resp) => {
        this.rectorias = resp.rectorias.data ?? [];
        this.sedes = resp.sedes.data ?? [];
        this.modalidades = resp.modalidades.data ?? [];
        this.periodos = resp.periodos.data ?? [];
        this.tiposCalendario = resp.tiposCalendario.data ?? [];
        this.tiposPeriodo = resp.tiposPeriodo.data ?? [];
      },
      error: () => this.notificacion.mostrarError('Error cargando catálogos')
    });
  }

  // Guardar 
  guardar(): void {
    if (this.form.invalid) return;

    const idUsuario = this.authService.getIdUsuario();
    if (!idUsuario) {
      this.notificacion.mostrarError('No se pudo obtener el ID del usuario');
      return;
    }

    const calendario: any = {
      ...this.form.value,
      id_usuario: idUsuario,
      actividades: (this.form.value.actividades ?? []).map((act: any) => ({
        id: act.id,
        titulo: act.titulo?.trim(),
        estado: act.estado,
        subactividades: (act.subactividades ?? [])
          .filter((sub: any) => (sub.nombre ?? '').trim().length > 0)
          .map((sub: any) => ({
            id: sub.id,
            nombre: sub.nombre?.trim(),
            descripcion: (sub.descripcion ?? '').trim(),
            fecha_inicio: sub.fecha_inicio ? moment(sub.fecha_inicio).format('YYYY-MM-DD') : null,
            fecha_fin: sub.fecha_fin ? moment(sub.fecha_fin).format('YYYY-MM-DD') : null,
            estado: sub.estado
          }))
      }))
    };

    this.enviarDatos(calendario);
  }

  private enviarDatos(calendario: any): void {
    const idCalendario = this.route.snapshot.paramMap.get('id');

    if (idCalendario) {
      this.calendariosService.actualizarCalendario(Number(idCalendario), calendario).subscribe({
        next: () => {
          this.notificacion.mostrarExito('Calendario actualizado correctamente');
          this.router.navigate(['/dashboard']);
        },
        error: () => this.notificacion.mostrarError('Error al actualizar el calendario')
      });
    } else {
      this.calendariosService.crearCalendario(calendario).subscribe({
        next: () => {
          this.notificacion.mostrarExito('Calendario creado correctamente');
          this.router.navigate(['/dashboard']);
        },
        error: () => this.notificacion.mostrarError('Error al crear el calendario')
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
