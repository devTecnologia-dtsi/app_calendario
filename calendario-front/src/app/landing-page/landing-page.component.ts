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
          this.calendariosAcademicos = respuesta.data.filter(c => c.tipo_calendario.toLowerCase() === 'académico');
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