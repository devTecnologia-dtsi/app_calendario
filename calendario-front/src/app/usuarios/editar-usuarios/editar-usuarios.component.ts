import { Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-editar-usuarios',
  imports: [],
  templateUrl: './editar-usuarios.component.html',
  styleUrl: './editar-usuarios.component.css'
})
export class EditarUsuariosComponent {

  //Para convertir el id recibido a numero
  @Input({transform: numberAttribute})
  id!: number;
}
