// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-editar-calendarios',
//   imports: [],
//   templateUrl: './editar-calendarios.component.html',
//   styleUrl: './editar-calendarios.component.css'
// })
// export class EditarCalendariosComponent {

// }


import { Component, OnInit } from '@angular/core';
import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarioCreacionDTO } from '../calendarios';

@Component({
  selector: 'app-editar-calendarios',
  templateUrl: './editar-calendarios.component.html',
  styleUrls: ['./editar-calendarios.component.css']
})
export class EditarCalendariosComponent implements OnInit {
  modelo?: CalendarioCreacionDTO;

  constructor(
    private calendariosService: CalendariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.calendariosService.consultarCalendario(id).subscribe({
      // next: (respuesta) => (this.modelo = respuesta.data),
      error: (error) => console.error('Error al cargar el calendario:', error)
    });
  }

  guardarCambios(calendario: CalendarioCreacionDTO): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.calendariosService.actualizarCalendario(id, calendario).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => console.error('Error al actualizar el calendario:', error)
    });
  }
}