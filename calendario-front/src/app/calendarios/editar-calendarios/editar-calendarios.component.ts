import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendariosService } from '../../compartidos/servicios/calendarios.service';
import { CalendarioCreacionDTO, ActividadCreacionDTO, CalendarioDTO } from '../calendarios';
import { FormularioCalendariosComponent } from "../formulario-calendarios/formulario-calendarios.component";
import { MostrarErroresComponent } from "../../compartidos/componentes/mostrar-errores/mostrar-errores.component";
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';

@Component({
  selector: 'app-editar-calendarios',
  templateUrl: './editar-calendarios.component.html',
  styleUrls: ['./editar-calendarios.component.css'],
  imports: [
    FormularioCalendariosComponent,
    MostrarErroresComponent,
    CargandoComponent
]
})


export class EditarCalendariosComponent implements OnInit {

  // Propiedades
  modelo?: CalendarioCreacionDTO;
  calendario?: CalendarioDTO;
  errores: string[] = [];


  // Inyecciones de dependencias
  private calendariosService = inject(CalendariosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificacionService = inject(NotificacionService);
  
  // Inicialización del componente
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id) || id <= 0) {
      // console.error('ID inválido');
      this.notificacionService.mostrarError("ID de calendario no válido.");
      this.router.navigate(['/']);
      return;
    }

    // Consultar calendario
    this.calendariosService.consultarCalendario(id).subscribe({
      next: (respuesta) => {
        const calendario = respuesta.data;

        // Mapear actividades y subactividades
        const actividades: ActividadCreacionDTO[] = (calendario.actividades || []).map((act: any) => ({
          id: act.id, //ID de la actividad
          id_calendario: act.id_calendario,
          titulo: act.titulo,
          estado: act.estado,
          subactividades: (act.subactividades || []).map((sub: any) => ({
            id: sub.id, //ID de la subactividad
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
        this.router.navigate(['/dashboard']);
      }
    });
  }

  guardarCambios(calendario: CalendarioCreacionDTO) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.calendariosService.actualizarCalendario(id, calendario).subscribe({
      next: () => {
        console.log('Calendario actualizado');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al actualizar el calendario:', error);
      }
    });
  }
}
