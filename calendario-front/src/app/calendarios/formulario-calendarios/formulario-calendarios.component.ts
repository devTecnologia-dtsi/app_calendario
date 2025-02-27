import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarioCreacionDTO } from '../calendarios';

@Component({
  selector: 'app-formulario-calendarios',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './formulario-calendarios.component.html',
  styleUrls: ['./formulario-calendarios.component.css']
})
export class FormularioCalendariosComponent implements OnInit {

  private formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    id_usuario: [null, Validators.required],
    id_rectoria: [null, Validators.required],
    id_sede: [null, Validators.required],
    id_tipoCalendario: [null, Validators.required],
    estado: [1, Validators.required],
    fecha_creacion: [new Date(), Validators.required],
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
      fecha_creacion: [new Date(), Validators.required],
      subactividades: this.formBuilder.array([])
    });
  }

  nuevaSubActividad(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      estado: [1, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      fecha_creacion: [new Date(), Validators.required]
    });
  }

  agregarActividad(): void {
    this.actividades.push(this.nuevaActividad());
  }

  agregarSubActividad(actividadIndex: number): void {
    const subactividades = this.actividades.at(actividadIndex).get('subactividades') as FormArray;
    subactividades.push(this.nuevaSubActividad());
  }

  guardarCambios(): void {
    if (this.form.valid) {
      const calendario: CalendarioCreacionDTO = this.form.value;
      console.log(calendario);
      // Falta llamar al servicio para guardar el calendario
    }
  }
}
