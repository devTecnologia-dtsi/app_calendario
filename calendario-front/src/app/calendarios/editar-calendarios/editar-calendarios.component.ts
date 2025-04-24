import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
import { CalendarioCreacionDTO, ActividadCreacionDTO } from '../calendarios';

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

    if (isNaN(id) || id <= 0) {
      console.error('ID inválido');
      this.router.navigate(['/']);
      return;
    }

    this.calendariosService.consultarCalendario(id).subscribe({
      next: (respuesta) => {
        const calendario = respuesta.data;

        // Mapear actividades y subactividades
        const actividades: ActividadCreacionDTO[] = (calendario.actividades || []).map((act: any) => ({
          id_calendario: act.id_calendario,
          titulo: act.titulo,
          estado: act.estado,
          subactividades: (act.subactividades || []).map((sub: any) => ({
            nombre: sub.nombre,
            descripcion: sub.descripcion,
            fecha_inicio: sub.fecha_inicio,
            fecha_fin: sub.fecha_fin,
            estado: sub.estado
          }))
        }));

        this.modelo = {
          id_usuario: calendario.id_usuario,
          id_rectoria: calendario.id_rectoria,
          id_sede: calendario.id_sede,
          id_tipo_calendario: calendario.id_tipo_calendario,
          id_modalidad: calendario.id_modalidad,
          id_periodo_academico: calendario.id_periodo_academico,
          id_tipo_periodo: calendario.id_tipo_periodo,
          estado: calendario.estado,
          en_sede: calendario.en_sede,
          actividades
        };

        console.log('Modelo para editar:', this.modelo);
      },
      error: (error) => {
        console.error('Error al cargar el calendario:', error);
        this.router.navigate(['/']);
      }
    });
  }

  guardarCambios(calendario: CalendarioCreacionDTO): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.calendariosService.actualizarCalendario(id, calendario).subscribe({
      next: () => {
        console.log('Calendario actualizado');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al actualizar el calendario:', error);
      }
    });
  }
}
