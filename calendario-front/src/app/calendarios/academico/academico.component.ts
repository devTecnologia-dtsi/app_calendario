import { Component } from '@angular/core';
import { CrearCalendariosComponent } from "../crear-calendarios/crear-calendarios.component";
import { FormularioCalendariosComponent } from "../formulario-calendarios/formulario-calendarios.component";

@Component({
  selector: 'app-academico',
  imports: [CrearCalendariosComponent, FormularioCalendariosComponent],
  templateUrl: './academico.component.html',
  styleUrl: './academico.component.css'
})
export class AcademicoComponent {

}
