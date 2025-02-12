import { Component, Input, numberAttribute } from '@angular/core';
import { FormularioUsuariosComponent } from "../formulario-usuarios/formulario-usuarios.component";
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';

@Component({
  selector: 'app-editar-usuarios',
  imports: [FormularioUsuariosComponent],
  templateUrl: './editar-usuarios.component.html',
  styleUrl: './editar-usuarios.component.css'
})
export class EditarUsuariosComponent {

  //Para convertir el id recibido a numero
  @Input({transform: numberAttribute})
  id!: number;

  usuario: UsuarioDTO = {
    id: 1, 
    correo: 'jeyson@uniminuto', 
    estado: 1 , 
    id_rectoria: 1 , 
    id_sede: 2, 
    fecha_ingreso: new Date(), 
    fecha_creacion: new Date(), 
    id_rol: 3
  }

  guardarCambios(usaurio: UsuarioCreacionDTO){
    console.log('editando el usuario', usaurio)
  }
}
