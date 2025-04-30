import { Component } from '@angular/core';
import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
import { CalendarioCreacionDTO } from '../calendarios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-calendarios',
  templateUrl: './crear-calendarios.component.html',
  styleUrls: ['./crear-calendarios.component.css']
})
export class CrearCalendariosComponent {
  constructor(private calendariosService: CalendariosService, private router: Router) {}

  guardarCambios(calendario: CalendarioCreacionDTO): void {
    this.calendariosService.crearCalendario(calendario).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => console.error('Error al crear el calendario:', error)
    });
  }
}