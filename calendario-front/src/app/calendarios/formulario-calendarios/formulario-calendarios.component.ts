import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CalendarioCreacionDTO, ActividadCreacionDTO } from '../calendarios';
import { RectoriaService } from '../../compartidos/servicios/rectoria.service';
import { SedeService } from '../../compartidos/servicios/sede.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ModalidadesService } from '../../compartidos/servicios/modalidades.service';
import { PeriodosService } from '../../compartidos/servicios/periodos.service';
import { TipoCalendariosService } from '../../compartidos/servicios/tipo-calendarios.service';
import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
import { ActividadService } from '../../compartidos/servicios/actividad.service';
import moment from 'moment';
import { SubactividadesService } from '../../compartidos/servicios/subactividades.service';
import { TiposPeriodoService } from '../../compartidos/servicios/tipos-periodo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
import { fechaFinPosteriorValidator, fechaNoPasadaValidator} from '../../compartidos/funciones/validaciones';

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
    MatNativeDateModule
  ]
})
export class FormularioCalendariosComponent implements OnInit {

  @Input() modelo?: CalendarioCreacionDTO;
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

  constructor() {
    this.form = this.fb.group({
      id_rectoria: [null, Validators.required],
      id_sede: [null, Validators.required],
      id_tipo_calendario: [null, Validators.required],
      id_modalidad: [null, Validators.required],
      id_tipo_periodo: [null, Validators.required],
      id_periodo_academico: [null, Validators.required],
      estado: [1],
      in_sede: [1],
      actividades: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const tipoCalendarioParam = this.route.snapshot.paramMap.get('tipo') ?? '';

    const tiposMap: Record<string, number> = {
      academico: 1,
      financiero: 2,
      grados: 3
    };

    const tiposTexto: Record<string, string> = {
      academico: 'académico',
      financiero: 'financiero',
      grados: 'de grados'
    };

    const idTipo = tiposMap[tipoCalendarioParam];
    if (idTipo) {
      this.form.patchValue({ id_tipo_calendario: idTipo });
      this.tituloFormulario = this.modelo
        ? `Editar calendario ${tiposTexto[tipoCalendarioParam]}`
        : `Crear calendario ${tiposTexto[tipoCalendarioParam]}`;
    }

    this.cargarRectorias();
    this.cargarModalidades();
    this.cargarPeriodos();
    this.cargarTiposCalendario();
    this.cargarTiposPeriodo();

    if (this.modelo) {
      this.form.patchValue(this.modelo);

      if (this.modelo.id_rectoria) {
        this.cargarSedes(this.modelo.id_rectoria);
      }

      this.modelo.actividades?.forEach((actividad) => {
        const actividadForm = this.fb.group({
          id: [actividad.id],
          id_calendario: [actividad.id_calendario],
          titulo: [actividad.titulo, Validators.required],
          estado: [actividad.estado],
          subactividades: this.fb.array([])
        });

        actividad.subactividades?.forEach((sub) => {
          const subForm = this.fb.group({
            id: [sub.id],
            nombre: [sub.nombre, Validators.required],
            descripcion: [sub.descripcion],
            fecha_inicio: [sub.fecha_inicio ? new Date(sub.fecha_inicio) : null],
            fecha_fin: [sub.fecha_fin ? new Date(sub.fecha_fin) : null],
            estado: [sub.estado]
          });
          (actividadForm.get('subactividades') as FormArray).push(subForm);
        });

        this.actividades.push(actividadForm);
      });
    }

    this.form.get('id_rectoria')?.valueChanges.subscribe((idRectoria) => {
      this.cargarSedes(idRectoria);
    });
  }

  get actividades(): FormArray {
    return this.form.get('actividades') as FormArray;
  }

  getSubactividades(index: number): FormArray {
    return this.actividades.at(index).get('subactividades') as FormArray;
  }

  agregarActividad(actividad?: ActividadCreacionDTO): void {
    const actividadForm = this.fb.group({
      id_calendario: [actividad?.id_calendario || null],
      titulo: [actividad?.titulo || '', Validators.required],
      estado: [1],
      subactividades: this.fb.array([])
    });
    this.actividades.push(actividadForm);
  }

  agregarSubactividad(index: number, sub?: any): void {
    const subactividadForm = this.fb.group({
      nombre: [sub?.nombre || '', Validators.required],
      descripcion: [sub?.descripcion || ''],
      fecha_inicio: [sub?.fecha_inicio || null, [fechaNoPasadaValidator]],
      fecha_fin: [sub?.fecha_fin || null, [fechaNoPasadaValidator, fechaFinPosteriorValidator('fecha_inicio')]],
      estado: [1]
    });
    this.getSubactividades(index).push(subactividadForm);
  }

  // Eliminar o desactivar actividad
  async eliminarActividad(index: number): Promise<void> {
    const actividad = this.actividades.at(index).value;

    const confirmacion = await this.notificacion.mostrarConfirmacion(
      '¿Seguro que quieres eliminar esta actividad?',
      'Confirmar eliminación'
    );

    if (!confirmacion) return;

    // Si tiene ID, desactiva del backend
    if (actividad.id) {
      this.actividadService.desactivarActividad(actividad.id).subscribe({
        next: (respuesta) => {
          if (respuesta.status === 1) {
            this.notificacion.mostrarExito(respuesta.message || 'Actividad desactivada correctamente');
          } else {
            this.notificacion.mostrarError(respuesta.message || 'No se pudo desactivar la actividad');
            return;
          }
          this.actividades.removeAt(index); // Siempre se remueve del formulario
        },
        error: () => this.notificacion.mostrarError('Error al desactivar la actividad')
      });
    } else {
      // Si no tiene ID (es nueva), solo la eliminamos del formulario
      this.actividades.removeAt(index);
    }
  }

  // Eliminar o desactivar subactividad
  async eliminarSubactividad(indexActividad: number, indexSub: number): Promise<void> {
    const subactividad = this.getSubactividades(indexActividad).at(indexSub).value;

    const confirmacion = await this.notificacion.mostrarConfirmacion(
      '¿Seguro que quieres eliminar esta subactividad?',
      'Confirmar eliminación'
    );

    if (!confirmacion) return;

    // Si tiene ID, desactiva del backend
    if (subactividad.id) {
      this.subactividadService.desactivarSubactividad(subactividad.id).subscribe({
        next: (respuesta) => {
          if (respuesta.status === 1) {
            this.notificacion.mostrarExito(respuesta.message || 'Subactividad desactivada correctamente');
          } else {
            this.notificacion.mostrarError(respuesta.message || 'No se pudo desactivar la subactividad');
            return;
          }
          this.getSubactividades(indexActividad).removeAt(indexSub); // Siempre se remueve
        },
        error: () => this.notificacion.mostrarError('Error al desactivar la subactividad')
      });
    } else {
      // Si no tiene ID (es nueva), solo la eliminamos del formulario
      this.getSubactividades(indexActividad).removeAt(indexSub);
    }
  }
 
  cargarRectorias() {
    this.rectoriaService.listarRectorias().subscribe({
      next: (r) => (this.rectorias = r.data),
      error: () => this.notificacion.mostrarError('Error al cargar rectorías')
    });
  }

  cargarSedes(idRectoria: number) {
    this.sedeService.listarSedesPorRectoria(idRectoria).subscribe({
      next: (r) => (this.sedes = r.data),
      error: () => this.notificacion.mostrarError('Error al cargar sedes')
    });
  }

  cargarModalidades() {
    this.modalidadService.listarModalidades().subscribe({
      next: (r) => (this.modalidades = r.data),
      error: () => this.notificacion.mostrarError('Error al cargar modalidades')
    });
  }

  cargarTiposPeriodo() {
    this.tiposPeriodoService.listarTiposPeriodo().subscribe({
      next: (r) => (this.tiposPeriodo = r.data),
      error: () => this.notificacion.mostrarError('Error al cargar tipos de periodo')
    });
  }

  cargarPeriodos() {
    this.periodoService.listarPeriodos().subscribe({
      next: (r) => (this.periodos = r.data),
      error: () => this.notificacion.mostrarError('Error al cargar periodos')
    });
  }

  cargarTiposCalendario() {
    this.tipoCalendarioService.listarTiposCalendarios().subscribe({
      next: (r) => (this.tiposCalendario = r.data),
      error: () => this.notificacion.mostrarError('Error al cargar tipos de calendario')
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      console.error('Formulario inválido', this.form.errors);
      return;
    }
  
    const calendario: any = {
      id_usuario: 17,
      id_rectoria: this.form.value.id_rectoria,
      id_sede: this.form.value.id_sede,
      id_tipo_calendario: this.form.value.id_tipo_calendario,
      id_modalidad: this.form.value.id_modalidad,
      id_periodo_academico: this.form.value.id_periodo_academico,
      id_tipo_periodo: this.form.value.id_tipo_periodo,
      estado: this.form.value.estado,
      en_sede: this.form.value.in_sede,
      actividades: this.form.value.actividades?.map((act: any) => ({
        id: act.id, 
        titulo: act.titulo,
        estado: act.estado,
        subactividades: act.subactividades?.map((sub: any) => ({
          id: sub.id, 
          nombre: sub.nombre,
          descripcion: sub.descripcion,
          fecha_inicio: sub.fecha_inicio ? moment(sub.fecha_inicio).format('YYYY-MM-DD') : null,
          fecha_fin: sub.fecha_fin ? moment(sub.fecha_fin).format('YYYY-MM-DD') : null,
          estado: sub.estado
        }))
      }))
    };

    console.log('Datos enviados al backend:', calendario);
  
    this.enviarDatos(calendario);
  }
  
  private enviarDatos(calendario: any): void {
    const idCalendario = this.route.snapshot.paramMap.get('id');
  
    if (idCalendario) {
      // **Actualizar**
      this.calendariosService.actualizarCalendario(Number(idCalendario), calendario).subscribe({
        next: () => {
          this.notificacion.mostrarExito('Calendario actualizado correctamente');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.notificacion.mostrarError('Error al actualizar el calendario');
        }
      });
    } else {
      // **Crear**
      this.calendariosService.crearCalendario(calendario).subscribe({
        next: () => {
          this.notificacion.mostrarExito('Calendario creado correctamente');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.notificacion.mostrarError('Error al crear el calendario');
        }
      });
    }
  }
  
}
