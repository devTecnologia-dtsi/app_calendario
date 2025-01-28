import { Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-editar-sede',
  standalone: true,
  imports: [],
  templateUrl: './editar-sede.component.html',
  styleUrl: './editar-sede.component.css'
})
export class EditarSedeComponent {
  
  @Input({transform: numberAttribute})
  id! : number;

}
