import { Component, inject } from '@angular/core';
import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
import { CalendarioCreacionDTO } from '../calendarios';
import { Router } from '@angular/router';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';

@Component({
  selector: 'app-crear-calendarios',
  templateUrl: './crear-calendarios.component.html',
  styleUrls: ['./crear-calendarios.component.css']
})
export class CrearCalendariosComponent {

  private calendariosService = inject(CalendariosService);
  private router = inject(Router);
  private notificacionService = inject(NotificacionService);
  
  guardarCambios(calendario: CalendarioCreacionDTO): void {
    this.calendariosService.crearCalendario(calendario).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      // error: (error) => console.error('Error al crear el calendario:', error)
      error: (error) => this.notificacionService.mostrarError('Error al crear el calendario', error),
    });
  }
}