import { Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-editar-rol',
  imports: [],
  templateUrl: './editar-rol.component.html',
  styleUrl: './editar-rol.component.css'
})
export class EditarRolComponent {

  //Para convertir el id recibido a numero
  @Input({transform:numberAttribute})
  id!: number;

}
