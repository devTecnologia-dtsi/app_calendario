import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarioCreacionDTO, CalendarioDTO } from '../calendarios';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-formulario-calendarios',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatNativeDateModule 
  ],
  templateUrl: './formulario-calendarios.component.html',
  styleUrls: ['./formulario-calendarios.component.css']
})
export class FormularioCalendariosComponent implements OnInit {

  @Input()
  calendario?: CalendarioDTO;

  @Output()
  posteoFormulario = new EventEmitter<CalendarioCreacionDTO>();

  private formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    id_usuario: [null, Validators.required],
    id_rectoria: [null, Validators.required],
    id_sede: [null, Validators.required],
    id_tipoCalendario: [null, Validators.required],
    estado: [1, Validators.required],
    fecha_creacion: new FormControl<Date | null>(null, {validators: [Validators.required]}),
    in_sede: [null, Validators.required],
    id_periodo: [null, Validators.required],
    actividades: this.formBuilder.array([])
  });

  ngOnInit(): void {
  }

  get actividades(): FormArray {
    return this.form.get('actividades') as FormArray;
  }

  nuevaActividad(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
      fecha_creacion: new FormControl<Date | null>(null, {validators: [Validators.required]}),
      subactividades: this.formBuilder.array([])
    });
  }

  nuevaSubActividad(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
      fecha_inicio: new FormControl<Date | null>(null, {validators: [Validators.required]}),
      fecha_fin: new FormControl<Date | null>(null, {validators: [Validators.required]}),
      fecha_creacion: new FormControl<Date | null>(null, {validators: [Validators.required]}),
    });
  }

  agregarActividad(): void {
    this.actividades.push(this.nuevaActividad());
  }

  agregarSubActividad(actividadIndex: number): void {
    const subactividades = this.actividades.at(actividadIndex).get('subactividades') as FormArray;
    subactividades.push(this.nuevaSubActividad());
  }

  getSubactividadesControls(actividad: AbstractControl): AbstractControl[] {
    return (actividad.get('subactividades') as FormArray).controls;
  }

  guardarCambios(): void {
    if (this.form.valid) {
      const calendario: CalendarioCreacionDTO = this.form.value;
      console.log(calendario);
      // Falta llamar al servicio para guardar el calendario
    }
  }
}
