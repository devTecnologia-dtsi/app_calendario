import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editar-calendarios',
  standalone: true,
  imports: [],
  templateUrl: './editar-calendarios.component.html',
  styleUrl: './editar-calendarios.component.css'
})
export class EditarCalendariosComponent {
  @Input()
  id! : number;
}

