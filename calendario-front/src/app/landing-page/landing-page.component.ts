// import { Component, OnInit } from '@angular/core';
// import { ListadoCalendariosComponent } from "../calendarios/listado-calendarios/listado-calendarios.component";

// @Component({
//   selector: 'app-landing-page',
//   imports: [ListadoCalendariosComponent],
//   templateUrl: './landing-page.component.html',
//   styleUrl: './landing-page.component.css'
// })
// export class LandingPageComponent implements OnInit{
//   ngOnInit(): void {
//     setTimeout(() => {

//       this.calendariosFinancieros = [{
//         tipoCalendario: 1, 
//         usuario: 'Jeyson Triana',
//         rectoria: 'Bogotá',
//         sede: 'Calle 80',
//         nombreActividad: 'Actividad 1',
//         estadoActividad: 1,
//         fechaCreacionActividad: new Date(),
//         nombreSubactividad: 'Sub actividad 1',
//         estadoSubActividad: 1,
//         fechaInicio: new Date("2024-01-02"),
//         fechaFin: new Date("2024-02-03"),
//         FechaCreacionSubactividad: new Date(), 
//         imagen:'financiero.avif', 
//       }
//       ];

//       this.calendariosAcademicos = [
//         {
//         tipoCalendario: 2,
//         usuario: 'Alejandra Rueda',
//         rectoria: 'Bogotá',
//         sede: 'Calle 90',
//         nombreActividad: 'Actividad 2',
//         estadoActividad: 1,
//         fechaCreacion: new Date(),
//         nombreSubactividad: 'Sub actividad 2',
//         estadoSubActividad: 1,
//         fechaInicio: new Date("2025-01-02"),
//         fechaFin: new Date("2025-02-03"),
//         FechaCreacion: new Date(),
//         imagen: 'grados.jpg'
//       },
//       {
//         tipoCalendario: 2,
//         usuario: 'Alejandra Rueda Jaramillo',
//         rectoria: 'Bogotá',
//         sede: 'Calle 90',
//         nombreActividad: 'Actividad 2',
//         estadoActividad: 1,
//         fechaCreacion: new Date(),
//         nombreSubactividad: 'Sub actividad 2',
//         estadoSubActividad: 1,
//         fechaInicio: new Date("2025-01-02"),
//         fechaFin: new Date("2025-02-03"),
//         FechaCreacion: new Date(),
//         imagen: 'grados.jpg'
//       }
//     ];

//       this.calendariosGrados = [
//         {
//         tipoCalendario: 3, 
//         usuario: 'Jeyson Triana Muñoz',
//         rectoria: 'Bogotá',
//         sede: 'Calle 80',
//         nombreActividad: 'Actividad 1',
//         estadoActividad: 1,
//         fechaCreacionActividad: new Date(),
//         nombreSubactividad: 'Sub actividad 1',
//         estadoSubActividad: 1,
//         fechaInicio: new Date("2024-01-02"),
//         fechaFin: new Date("2024-02-03"),
//         FechaCreacionSubactividad: new Date(), 
//         imagen:'financiero.avif', 
//       }
//     ];
    
//       }, 100);    
//   }

//   calendariosAcademicos!: any[];
//   calendariosFinancieros!: any[];
//   calendariosGrados!: any[];


// }


import { Component, inject, OnInit } from '@angular/core';
import { CalendariosService } from '../compartidos/servicios/calendarios.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  calendariosAcademicos: any[] = [];
  calendariosFinancieros: any[] = [];
  calendariosGrados: any[] = [];

  private calendariosService = inject(CalendariosService)

  ngOnInit(): void {
    this.cargarCalendarios();
  }

  cargarCalendarios(): void {
    this.calendariosService.listarCalendarios().subscribe({
      next: (respuesta) => {
        console.log('Respuesta completa:', respuesta);
        if (respuesta && Array.isArray(respuesta.data)) {
          // Filtrar calendarios por tipo
          this.calendariosAcademicos = respuesta.data.filter(c => c.tipo_calendario.toLowerCase() === 'academico');
          this.calendariosFinancieros = respuesta.data.filter(c => c.tipo_calendario.toLowerCase() === 'financiero');
          this.calendariosGrados = respuesta.data.filter(c => c.tipo_calendario.toLowerCase() === 'grados');
        }
      },
      error: (error) => {
        console.error('Error al cargar los calendarios:', error);
      }
    });
  }
}