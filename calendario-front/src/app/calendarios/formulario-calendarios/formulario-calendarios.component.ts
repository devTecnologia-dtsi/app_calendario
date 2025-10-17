import { Component, OnInit, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { catchError, forkJoin, of } from 'rxjs';
import { format } from 'date-fns';
import { CalendarioCreacionDTO, ActividadCreacionDTO } from '../calendarios';
import { Rectoria, RectoriaService } from '../../compartidos/servicios/rectoria.service';
import { SedeDTO, SedeService } from '../../compartidos/servicios/sede.service';
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
import { MatExpansionModule } from '@angular/material/expansion';


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
    CdkTableModule,
    MatExpansionModule
  ],
})
export class FormularioCalendariosComponent implements OnInit {
  private _modelo?: CalendarioCreacionDTO;
  tipoCalendario!: 'admin' | 'academico' | 'financiero' | 'grados';

  @Input() set modelo(value: CalendarioCreacionDTO | undefined) {
    if (value && value !== this._modelo) {
      // console.log('Recibiendo modelo para edición:', value);
      this._modelo = value;
      
      // Si ya se inicializó el componente aplicar el modelo inmediatamente
      if (this.componenteInicializado) {
        this.aplicarModeloAlFormulario();
      }
    }
  }

get modelo(): CalendarioCreacionDTO | undefined {
  return this._modelo;
}

private componenteInicializado = false;

  @Output() posteoFormulario = new EventEmitter<CalendarioCreacionDTO>();

  form: FormGroup;
  rectorias: Rectoria[] = [];
  sedes: SedeDTO[] = [];
  modalidades: any[] = [];
  periodos: any[] = [];
  tiposPeriodo: any[] = [];
  tiposCalendario: any[] = [];
  tituloFormulario = '';

  // Métodos trackBy para mejorar rendimiento
  rectoriaTrackBy = (_: number, item: any) => item.id_rectoria;
  sedeTrackBy = (_: number, item: any) => item.id;
  modalidadTrackBy = (_: number, item: any) => item.id;
  tipoPeriodoTrackBy = (_: number, item: any) => item.id;
  periodoTrackBy = (_: number, item: any) => item.id;
  actividadTrackBy = (_: number, item: any) => item.value?.id ?? _;
  subactividadTrackBy = (_: number, item: any) => item.value?.id ?? _;

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

  private tiposCalendarioMap: Record<
    string,
    { id: number; texto: string }
  > = {
    academico: { id: 1, texto: 'académico' },
    financiero: { id: 2, texto: 'financiero' },
    grados: { id: 3, texto: 'grados' },
  };

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
      actividades: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.tipoCalendario = this.route.snapshot.paramMap.get('tipo') as any;

    if (!this._modelo) {
      // Crear
      const tipoParam = this.route.snapshot.paramMap.get('tipo') ?? '';
      const tipoSeleccionado = this.tiposCalendarioMap[tipoParam];
      if (tipoSeleccionado) {
        this.tituloFormulario = `Crear calendario ${tipoSeleccionado.texto}`;
        this.form.patchValue({ id_tipo_calendario: tipoSeleccionado.id });
      }
      this.cargarCatalogos();
    } else {
      // Editar
      this.tituloFormulario = 'Editar calendario';
      this.cargarCatalogosYAsignarModelo();
    }

    // Escucha cambio de rectoría
    this.form.get('id_rectoria')?.valueChanges.subscribe((idRectoria) => {
      if (idRectoria && !this.cargandoSedes) {
        this.form.get('id_sede')?.setValue(null);
        this.cargarSedesPorRectoria(idRectoria);
      } else if (!idRectoria) {
        this.sedes = [];
      }
    });

    this.componenteInicializado = true;
  }

  private cargandoSedes = false;

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
      fecha_inicio: [fecha_inicio_original ?? null, [fechaNoPasadaValidator(fecha_inicio_original)]],
      fecha_fin: [fecha_fin_original ?? null,[fechaFinPosteriorValidator('fecha_inicio', fecha_fin_original)]],
      estado: [sub?.estado ?? 1]
    });
  }

  agregarActividad(actividad?: ActividadCreacionDTO): void {
    this.actividades.push(this.crearActividadForm(actividad));
  }

  async eliminarActividad(index: number): Promise<void> {
    const actividad = this.actividades.at(index).value;
    const ok = await this.notificacion.mostrarConfirmacion(
      '¿Seguro que quieres eliminar esta actividad?',
      'Confirmar eliminación'
    );
    if (!ok) return;

    if (actividad.id) {
      this.actividadService.desactivarActividad(actividad.id).subscribe({
        next: (r) => {
          if (r.status === 1) {
            this.notificacion.mostrarExito(
              r.message || 'Actividad desactivada correctamente'
            );
            this.actividades.removeAt(index);
          } else {
            this.notificacion.mostrarError(
              r.message || 'No se pudo desactivar la actividad'
            );
          }
        },
        error: () =>
          this.notificacion.mostrarError('Error al desactivar la actividad'),
      });
    } else {
      this.actividades.removeAt(index);
    }
  }

  agregarSubactividad(index: number, sub?: any): void {
    this.getSubactividades(index).push(this.crearSubactividadForm(sub));
  }

  async eliminarSubactividad(
    indexActividad: number,
    indexSub: number
  ): Promise<void> {
    const sub = this.getSubactividades(indexActividad).at(indexSub).value;
    const ok = await this.notificacion.mostrarConfirmacion(
      '¿Seguro que quieres eliminar esta subactividad?',
      'Confirmar eliminación'
    );
    if (!ok) return;

    if (sub.id) {
      this.subactividadService.desactivarSubactividad(sub.id).subscribe({
        next: (r) => {
          if (r.status === 1) {
            this.notificacion.mostrarExito(
              r.message || 'Subactividad desactivada correctamente'
            );
            this.getSubactividades(indexActividad).removeAt(indexSub);
          } else {
            this.notificacion.mostrarError(
              r.message || 'No se pudo desactivar la subactividad'
            );
          }
        },
        error: () =>
          this.notificacion.mostrarError('Error al desactivar la subactividad'),
      });
    } else {
      this.getSubactividades(indexActividad).removeAt(indexSub);
    }
  }

  private cargarCatalogos(): void {
    // Determinar el rol a enviar al backend
    let rolParaBackend: 'admin' | 'academico' | 'financiero' | 'grados';
    
    // Verificar si el usuario es admin
    const esAdmin = this.authService.tienePermisoPara('admin', 'leer');
    
    if (esAdmin) {
      // Si es admin, enviar 'admin' al backend
      rolParaBackend = 'admin';
      // console.log('Usuario es ADMIN - Cargando todas las rectorías');
    } else {
      // Si no es admin, usar el tipo del calendario
      const tipoParam = this.route.snapshot.paramMap.get('tipo') as 'academico' | 'financiero' | 'grados';
      rolParaBackend = tipoParam || this.tipoCalendario as any;
      // console.log('Usuario con rol específico:', rolParaBackend);
    }

    // Guardar el tipo del calendario (para otros usos)
    const tipoParam = this.route.snapshot.paramMap.get('tipo') as 'academico' | 'financiero' | 'grados';
    this.tipoCalendario = tipoParam || this.tipoCalendario;

    // console.log('Cargando catálogos - Rol para backend:', rolParaBackend);
    // console.log('Tipo de calendario:', this.tipoCalendario);

    forkJoin({
      rectorias: this.rectoriaService.listarRectoriasPorUsuario(rolParaBackend).pipe(catchError((err) => {
          console.error('Error cargando rectorías:', err);
          return of({ data: [] });
        })),

      sedes: this.sedeService.listarSedesPorUsuario().pipe(catchError(() => of({ data: [] }))),
      modalidades: this.modalidadService.listarModalidades().pipe(catchError(() => of({ data: [] }))),
      periodos: this.periodoService.listarPeriodos().pipe(catchError(() => of({ data: [] }))),
      tiposCalendario: this.tipoCalendarioService.listarTiposCalendarios().pipe(catchError(() => of({ data: [] }))),
      tiposPeriodo: this.tiposPeriodoService.listarTiposPeriodo().pipe(catchError(() => of({ data: [] }))),

    }).subscribe({
      next: (resp) => {
        // console.log('Catálogos cargados:', resp);
        
        this.rectorias = resp.rectorias.data ?? [];
        this.sedes = resp.sedes.data ?? [];
        this.modalidades = resp.modalidades.data ?? [];
        this.periodos = resp.periodos.data ?? [];
        this.tiposCalendario = resp.tiposCalendario.data ?? [];
        this.tiposPeriodo = resp.tiposPeriodo.data ?? [];
        
        // console.log('Rectorías cargadas:', this.rectorias);
        // console.log('Sedes cargadas:', this.sedes);
      },
      error: (err) => {
        console.error('Error cargando catálogos:', err);
        this.notificacion.mostrarError('Error cargando catálogos');
      },
    });
  }

  // Aplica el modelo al formulario (separado de la carga de catálogos)
  private aplicarModeloAlFormulario(): void {
    if (!this._modelo) return;

    // console.log('Aplicando modelo al formulario:', this._modelo);

    this.cargandoSedes = true; // Evitar que se dispare valueChanges

    this.form.patchValue({
      id_rectoria: Number(this._modelo.id_rectoria),
      id_sede: Number(this._modelo.id_sede),
      id_tipo_calendario: Number(this._modelo.id_tipo_calendario),
      id_modalidad: Number(this._modelo.id_modalidad),
      id_tipo_periodo: Number(this._modelo.id_tipo_periodo),
      id_periodo_academico: Number(this._modelo.id_periodo_academico),
      estado: this._modelo.estado,
      en_sede: this._modelo.en_sede,
    }, { emitEvent: false });

    this.cargandoSedes = false;

    // console.log('Formulario parcheado:', this.form.value);

    // Carga sedes según rectoría
    if (this._modelo.id_rectoria) {
      this.cargarSedesPorRectoria(Number(this._modelo.id_rectoria));
    }

    // Carga actividades y subactividades
    this.cargarActividadesDesdeModelo();

    this.cdr.detectChanges();
  }

  // Carga las actividades y subactividades desde el modelo
  private cargarActividadesDesdeModelo(): void {
    this.actividades.clear();

    if (!Array.isArray(this._modelo?.actividades) || this._modelo.actividades.length === 0) {
      console.warn('No hay actividades en el modelo');
      return;
    }

    // console.log('Construyendo actividades desde el modelo:', this._modelo.actividades);

    this._modelo.actividades.forEach((actividad) => {
      const actividadFG = this.crearActividadForm(actividad);
      this.actividades.push(actividadFG);
      
      // console.log(`Actividad "${actividad.titulo}" con ${actividad.subactividades?.length || 0} subactividades`);
    });

    // console.log('Actividades completas en el formulario:', this.actividades.value);
  }

  private cargarCatalogosYAsignarModelo(): void {
    // Determinar el tipo de calendario
    let tipoCalendario: 'academico' | 'financiero' | 'grados';
    
    if (this._modelo?.id_tipo_calendario) {
      const tipoEncontrado = Object.entries(this.tiposCalendarioMap)
        .find(([_, info]) => info.id === Number(this._modelo!.id_tipo_calendario));
      tipoCalendario = tipoEncontrado?.[0] as any;
    } else {
      const tipoParam = this.route.snapshot.paramMap.get('tipo') as 'academico' | 'financiero' | 'grados';
      tipoCalendario = tipoParam;
    }
    
    this.tipoCalendario = tipoCalendario;

    // Determinar el rol para el backend
    let rolParaBackend: 'admin' | 'academico' | 'financiero' | 'grados';
    const esAdmin = this.authService.tienePermisoPara('admin', 'leer');
    
    if (esAdmin) {
      rolParaBackend = 'admin';
      // console.log('Usuario es ADMIN (edición) - Cargando todas las rectorías');
    } else {
      rolParaBackend = tipoCalendario;
      // console.log('Usuario con rol específico (edición):', rolParaBackend);
    }

    // console.log('Cargando catálogos (modo edición) - Rol para backend:', rolParaBackend);
    // console.log('Tipo de calendario:', this.tipoCalendario);

    forkJoin({
      
      rectorias: this.rectoriaService.listarRectoriasPorUsuario(rolParaBackend).pipe(catchError(() => of({ data: [] }))),
      sedes: this.sedeService.listarSedesPorUsuario().pipe(catchError(() => of({ data: [] }))), 
      modalidades: this.modalidadService.listarModalidades().pipe(catchError(() => of({ data: [] }))),
      periodos: this.periodoService.listarPeriodos().pipe(catchError(() => of({ data: [] }))),
      tiposCalendario: this.tipoCalendarioService.listarTiposCalendarios().pipe(catchError(() => of({ data: [] }))),
      tiposPeriodo: this.tiposPeriodoService.listarTiposPeriodo().pipe(catchError(() => of({ data: [] }))),

    }).subscribe({
      next: (resp) => {
        // console.log('Catálogos cargados (modo edición):', resp);

        this.rectorias = resp.rectorias.data ?? [];
        this.sedes = resp.sedes.data ?? [];
        this.modalidades = resp.modalidades.data ?? [];
        this.periodos = resp.periodos.data ?? [];
        this.tiposCalendario = resp.tiposCalendario.data ?? [];
        this.tiposPeriodo = resp.tiposPeriodo.data ?? [];

        // console.log('Rectorías cargadas (edición):', this.rectorias);

        // Aplicar el modelo al formulario
        this.aplicarModeloAlFormulario();
      },
      error: (err) => {
        console.error('Error cargando catálogos (modo edición):', err);
        this.notificacion.mostrarError('Error cargando catálogos para edición');
      },
    });
  }

  cargarSedesPorRectoria(idRectoria: number): void {
    const tipo = this.tipoCalendario as 'academico' | 'financiero' | 'grados';
    if (!tipo || !idRectoria) return;

    // ('Cargando sedes para rectoría:', idRectoria, 'tipo:', tipo);

    const permisos = this.authService.getPermisos();
    // console.log('Permisos del usuario:', permisos);

    // Filtrar permisos: admin O el tipo específico
    const sedesFiltradas = permisos.filter((p) => {
      const esLaMismaRectoria = p.id_rectoria === idRectoria;
      const tienePermisoTipo = this.coincideConTipoCalendario(p.nombre_rol, tipo);
      
      return esLaMismaRectoria && tienePermisoTipo;
    });

    // console.log('Sedes filtradas:', sedesFiltradas);

    const sedesUnicas = new Map<number, SedeDTO>();
    sedesFiltradas.forEach((p) => {
      sedesUnicas.set(p.id_sede, {
        id: p.id_sede,
        codigo: '',
        nombre: p.nombre_sede,
        id_rectoria: p.id_rectoria,
      });
    });

    this.sedes = Array.from(sedesUnicas.values());
    // console.log('Sedes únicas cargadas:', this.sedes);
  }

  private coincideConTipoCalendario(nombreRol: string, tipo: string): boolean {
    if (!nombreRol || !tipo) return false;

    const rol = nombreRol.toLowerCase();
    const tipoLower = tipo.toLowerCase();

    if (tipoLower === 'academico' && rol.includes('academico')) return true;
    if (tipoLower === 'financiero' && rol.includes('financiero')) return true;
    if (tipoLower === 'grados' && rol.includes('grado')) return true;
    if (rol === 'admin') return true;

    return false;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const idUsuario = this.authService.getIdUsuario();
    if (!idUsuario) {
      this.notificacion.mostrarError('No se pudo obtener el ID del usuario');
      return;
    }

    const calendario = {
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
            fecha_inicio: sub.fecha_inicio
              ? format(sub.fecha_inicio, 'yyyy-MM-dd')
              : null,
            fecha_fin: sub.fecha_fin
              ? format(sub.fecha_fin, 'yyyy-MM-dd')
              : null,
            estado: sub.estado,
          })),
      })),
    };

    this.enviarDatos(calendario);
  }

  private enviarDatos(calendario: any): void {
    const idCalendario = this.route.snapshot.paramMap.get('id');

    if (idCalendario) {
      this.calendariosService
        .actualizarCalendario(Number(idCalendario), calendario)
        .subscribe({
          next: () => {
            this.notificacion.mostrarExito(
              'Calendario actualizado correctamente'
            );
            this.router.navigate(['/dashboard']);
          },
          error: () =>
            this.notificacion.mostrarError('Error al actualizar el calendario'),
        });
    } else {
      this.calendariosService.crearCalendario(calendario).subscribe({
        next: () => {
          this.notificacion.mostrarExito('Calendario creado correctamente');
          this.router.navigate(['/dashboard']);
        },
        error: () =>
          this.notificacion.mostrarError('Error al crear el calendario'),
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
