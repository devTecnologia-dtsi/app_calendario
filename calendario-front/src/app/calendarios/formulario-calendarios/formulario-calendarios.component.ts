import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CalendarioCreacionDTO, ActividadCreacionDTO, CalendarioRespuestaAPI, RespuestaAPIActividades } from '../calendarios';
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

@Component({
  selector: 'app-formulario-calendarios',
  templateUrl: './formulario-calendarios.component.html',
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
  ],
  styleUrls: ['./formulario-calendarios.component.css']
})
export class FormularioCalendariosComponent implements OnInit {
  @Input() modelo?: CalendarioCreacionDTO;
  @Output() onSubmit = new EventEmitter<CalendarioCreacionDTO>();

  form: FormGroup;
  rectorias: any[] = [];
  sedes: any[] = [];
  modalidades: any[] = [];
  periodos: any[] = [];
  tiposPeriodo: any[] = [];
  tiposCalendario: any[] = [];
  mostrarFechas: boolean[] = [];

  private formBuilder = inject(FormBuilder);
  private rectoriaService = inject(RectoriaService);
  private sedeService = inject(SedeService);
  private modalidadService = inject(ModalidadesService);
  private periodoService = inject(PeriodosService);
  private tipoCalendarioService = inject(TipoCalendariosService);
  private calendarios = inject(CalendariosService);
  private actividad = inject(ActividadService);
  private subactividadService = inject(SubactividadesService);
  private tiposPeriodoService = inject(TiposPeriodoService);

  constructor() {
    this.form = this.formBuilder.group({
      id_rectoria: [null, Validators.required],
      id_sede: [null, Validators.required],
      id_tipo_calendario: [null, Validators.required],
      id_modalidad: [null, Validators.required],
      // id_periodo: [null, Validators.required],
      id_tipo_periodo: [null, Validators.required],
      id_periodo_academico: [null, Validators.required],
      estado: [1],
      in_sede: [1],
      actividades: this.formBuilder.array([])
      
    });
  }

  ngOnInit(): void {
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
      if (this.modelo.actividades) {
        this.modelo.actividades.forEach((actividad) => this.agregarActividad(actividad));
      }
    }

    this.form.get('id_rectoria')?.valueChanges.subscribe((idRectoria) => {
      this.cargarSedes(idRectoria);
    });
  }

  get actividades(): FormArray {
    return this.form.get('actividades') as FormArray;
  }

  agregarActividad(actividad?: ActividadCreacionDTO): void {
    const actividadForm = this.formBuilder.group({
      id_calendario: [actividad?.id_calendario || null],
      titulo: [actividad?.titulo || '', Validators.required],
      estado: [1],
      subactividades: this.formBuilder.array([])

    });
    this.actividades.push(actividadForm);
    this.mostrarFechas.push(false); // Inicializa el control de visibilidad de fechas
  }

  getSubactividades(index: number): FormArray {
    return this.actividades.at(index).get('subactividades') as FormArray;
  }
  
  agregarSubactividad(actividadIndex: number, subactividad?: any): void {
    const subactividadForm = this.formBuilder.group({
      nombre: [subactividad?.nombre || '', Validators.required],
      descripcion: [subactividad?.descripcion || ''],
      fecha_inicio: [subactividad?.fecha_inicio || null],
      fecha_fin: [subactividad?.fecha_fin || null],
      estado: [1]
    });
    this.getSubactividades(actividadIndex).push(subactividadForm);
  }
  
  eliminarSubactividad(actividadIndex: number, subactividadIndex: number): void {
    this.getSubactividades(actividadIndex).removeAt(subactividadIndex);
  }

  eliminarActividad(index: number): void {
    this.actividades.removeAt(index);
    this.mostrarFechas.splice(index, 1); // Elimina el control de visibilidad de fechas
  }

  toggleFechas(index: number): void {
    this.mostrarFechas[index] = !this.mostrarFechas[index];
  }

  eliminarFechas(index: number): void {
    const actividad = this.actividades.at(index);
    actividad.patchValue({ fecha_inicio: null, fecha_fin: null });
    this.mostrarFechas[index] = false; // Oculta las fechas después de eliminarlas
  }

  cargarRectorias(): void {
    this.rectoriaService.listarRectorias().subscribe({
      next: (response) => {
        this.rectorias = response.data;
      },
      error: () => console.error('Error al cargar rectorías')
    });
  }

  cargarSedes(idRectoria: number): void {
    this.sedeService.listarSedesPorRectoria(idRectoria).subscribe({
      next: (response) => {
        this.sedes = response.data;
      },
      error: () => console.error('Error al cargar sedes')
    });
  }

  cargarModalidades(): void {
    this.modalidadService.listarModalidades().subscribe({
      next: (response) => {
        this.modalidades = response.data;
      },
      error: () => console.error('Error al cargar modalidades')
    });
  }

  cargarTiposPeriodo(): void {
    this.tiposPeriodoService.listarTiposPeriodo().subscribe({
      next: (response) => {
        this.tiposPeriodo = response.data;
      },
      error: () => console.error('Error al cargar tipos de periodo')
    });
  }

  cargarPeriodos(): void {
    this.periodoService.listarPeriodos().subscribe({
      next: (response) => {
        this.periodos = response.data;
      },
      error: () => console.error('Error al cargar periodos')
    });
  }

  cargarTiposCalendario(): void {
    this.tipoCalendarioService.listarTiposCalendarios().subscribe({
      next: (response) => {
        this.tiposCalendario = response.data;
      },
      error: () => console.error('Error al cargar tipos de calendario')
    });
  }

  // guardar(): void {
  //   if (this.form.valid) {
  //     console.log('Formulario válido. Enviando datos...');
  //     const datosFormulario = this.form.value;
  //     console.log('Datos del formulario:', datosFormulario);
  //     this.enviarDatos(datosFormulario.calendario, datosFormulario.actividades);
  //   } else {
  //     console.error('El formulario no es válido:', this.form.errors);
  //     console.log('Estado del formulario:', this.form.status);
  //     console.log('Controles del formulario:', this.form.controls);
  
  //     this.actividades.controls.forEach((actividad, index) => {
  //       console.log(`Estado de la actividad ${index + 1}:`, actividad.status);
  //       console.log(`Errores de la actividad ${index + 1}:`, actividad.errors);
  
  //       const subactividades = this.getSubactividades(index);
  //       subactividades.controls.forEach((subactividad, subIndex) => {
  //         console.log(`Estado de la subactividad ${subIndex + 1} de la actividad ${index + 1}:`, subactividad.status);
  //         console.log(`Errores de la subactividad ${subIndex + 1} de la actividad ${index + 1}:`, subactividad.errors);
  //       });
  //     });
  //   }
  // }

  guardar() {
    if (this.form.invalid) return console.error('Formulario inválido');
  
    const cal: CalendarioCreacionDTO = {
      id_usuario: 17,
      id_rectoria:      this.form.value.id_rectoria,
      id_sede:          this.form.value.id_sede,
      id_tipo_calendario: this.form.value.id_tipo_calendario,
      id_modalidad:     this.form.value.id_modalidad,
      id_periodo_academico:       this.form.value.id_periodo_Academico,
      id_tipo_periodo:  this.form.value.id_tipo_periodo,
      estado:           this.form.value.estado,
      en_sede:          this.form.value.in_sede
    };
  
    const actividades = this.form.value.actividades.map((act: any) => ({
      titulo:       act.titulo,
      estado:       act.estado,
      // subactividades las añadiremos tras crear la actividad
      subactividades: act.subactividades?.map((sub: any) => ({
        nombre:       sub.nombre,
        descripcion:  sub.descripcion,
        fecha_inicio: sub.fecha_inicio ? moment(sub.fecha_inicio).format('YYYY-MM-DD') : null,
        fecha_fin:    sub.fecha_fin    ? moment(sub.fecha_fin).format('YYYY-MM-DD')    : null,
        estado:       sub.estado
      }))
    }));
  
    this.enviarDatos(cal, actividades);
  }
  
  private enviarDatos(calendario: CalendarioCreacionDTO, actividades: ActividadCreacionDTO[]): void {
    this.calendarios.crearCalendario(calendario).subscribe({
      next: (respuestaCalendario: CalendarioRespuestaAPI) => {
        console.log('Calendario creado:', respuestaCalendario);
  
        // Obtener el ID del calendario creado
        const idCalendario = respuestaCalendario.data?.id_calendario;
  
        if (idCalendario) {
          actividades.forEach((actividad) => {
            actividad.id_calendario = idCalendario; // Asociar la actividad con el calendario
  
            // Enviar la actividad al backend
            this.actividad.crearActividad(actividad).subscribe({
              next: (respuestaActividad: RespuestaAPIActividades) => {
                console.log('Actividad creada:', respuestaActividad);
  
                // Obtener el ID de la actividad creada
                const idActividad = respuestaActividad.data?.id_actividad;
  
                if (idActividad && actividad.subactividades) {
                  // Enviar las subactividades al backend
                  actividad.subactividades.forEach((subactividad: any) => {
                    subactividad.id_actividad = idActividad; // Asociar la subactividad con la actividad
                    this.subactividadService.crearSubactividad(subactividad).subscribe({
                      next: (respuestaSubactividad) => {
                        console.log('Subactividad creada:', respuestaSubactividad);
                      },
                      error: (error: any) => {
                        console.error('Error al crear la subactividad:', error);
                      }
                    });
                  });
                }
              },
              error: (error: any) => {
                console.error('Error al crear la actividad:', error);
              }
            });
          });
        } else {
          console.error('No se pudo obtener el ID del calendario creado.');
        }
      },
      error: (error: any) => {
        console.error('Error al crear el calendario:', error);
      }
    });
  }
}