import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActividadService } from '../../compartidos/servicios/actividad.service';
import { SubactividadService } from '../../compartidos/servicios/subactividad.service';

@Component({
  selector: 'app-formulario-calendarios',
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
  ],
  templateUrl: './formulario-calendarios.component.html',
  styleUrls: ['./formulario-calendarios.component.css']
})
export class FormularioCalendariosComponent implements OnInit {
  form: FormGroup;

  // Inyección de servicios
  private actividadService = inject(ActividadService);
  private subActividadService = inject(SubactividadService);

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      actividades: this.formBuilder.array([]) // Array de actividades
    });
  }

  ngOnInit(): void {}

  // Obtener el FormArray de actividades
  get actividades(): FormArray {
    return this.form.get('actividades') as FormArray;
  }

  // Crear una nueva actividad
  nuevaActividad(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
      subactividades: this.formBuilder.array([]) // Array de subactividades
    });
  }

  // Crear una nueva subactividad
  nuevaSubActividad(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
    });
  }

  // Agregar una nueva actividad
  agregarActividad(): void {
    this.actividades.push(this.nuevaActividad());
  }

  // Eliminar una actividad
  eliminarActividad(index: number): void {
    this.actividades.removeAt(index);
  }

  // Obtener el FormArray de subactividades de una actividad
  getSubactividades(actividadIndex: number): FormArray {
    return this.actividades.at(actividadIndex).get('subactividades') as FormArray;
  }

  // Agregar una nueva subactividad a una actividad específica
  agregarSubActividad(actividadIndex: number): void {
    this.getSubactividades(actividadIndex).push(this.nuevaSubActividad());
  }

  // Eliminar una subactividad de una actividad específica
  eliminarSubActividad(actividadIndex: number, subActividadIndex: number): void {
    this.getSubactividades(actividadIndex).removeAt(subActividadIndex);
  }

  // Guardar cambios
  guardarCambios(): void {
    if (this.form.valid) {
      const calendario = this.form.value;
      console.log('Datos del formulario:', calendario);
      // Falta el servicio para guardar el calendario
    }
  }
}