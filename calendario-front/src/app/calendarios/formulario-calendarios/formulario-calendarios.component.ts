import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formulario-calendarios',
  imports: [
    MatButtonModule, 
    RouterLink, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './formulario-calendarios.component.html',
  styleUrl: './formulario-calendarios.component.css'
})
export class FormularioCalendariosComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    id_usuarios: [null as number | null],
    id_rectoria: [null as number | null],
    id_sede: [null as number | null],
    id_tipoCalendario: [null as number | null],
    estado: 1,
    fecha_creacion: new FormControl<Date | null>(null),
    in_sede: [null as number | null],
    id_periodo: [null as number | null],
    actividades : this.formBuilder.array([])
  })

}
