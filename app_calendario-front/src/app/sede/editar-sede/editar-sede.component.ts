import { Component, Input, numberAttribute } from '@angular/core';
import { FormularioSedeComponent } from '../formulario-sede/formulario-sede.component';
import { SedeCreacionDTO, SedeDTO } from '../sede';

@Component({
  selector: 'app-editar-sede',
  standalone: true,
  imports: [FormularioSedeComponent],
  templateUrl: './editar-sede.component.html',
  styleUrl: './editar-sede.component.css'
})
export class EditarSedeComponent {
  
  @Input({transform: numberAttribute})
  id! : number;

  sede: SedeDTO= {id:1, codigo:'Bog', nombre: 'Bogotá', id_rectoria: '1'};

  guardarCambios(sede: SedeCreacionDTO){
    console.log('editando la sede', sede);
  }

}
