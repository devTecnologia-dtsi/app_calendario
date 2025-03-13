import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mostrar-errores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mostrar-errores.component.html',
  styleUrls: ['./mostrar-errores.component.css']
})
export class MostrarErroresComponent {
  @Input({ required: true }) errores!: string[];
}
