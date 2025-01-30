import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formulario-calendarios',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule],
  templateUrl: './formulario-calendarios.component.html',
  styleUrl: './formulario-calendarios.component.css'
})

export class FormularioCalendariosComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    nombreActividad: ['', {validators: [Validators.required]}],

    estadoActividad: 1,

    fechaCreacionActividad: new FormControl<Date | null>(null),

    nombreSubActividad: ['', {validators: [Validators.required]}],

    estadoSubActividad: 1,

    fechaInicio: new FormControl<Date | null>(null),

    fechaFin: new FormControl<Date | null>(null),

    fechaCreacionSubActividad: new FormControl<Date | null>(null),

    tipo: ['Academico'],

  })

}
