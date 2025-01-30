import { Component, inject } from '@angular/core';
// import { FormularioCalendariosComponent } from '../formulario-calendarios/formulario-calendarios.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CalendarioCreacionDTO } from '../calendarios';
import { FormularioCalendariosComponent } from "../formulario-calendarios/formulario-calendarios.component";

@Component({
  selector: 'app-crear-calendarios',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    //RouterLink, //Boton de cancelacion
    ReactiveFormsModule,
    MatInputModule,
    FormularioCalendariosComponent
],
  templateUrl: './crear-calendarios.component.html',
  styleUrls: ['./crear-calendarios.component.css']
})

export class CrearCalendariosComponent {

  guardarCambios(calendario: CalendarioCreacionDTO){
    console.log('creando calendario',calendario);
  }
}
