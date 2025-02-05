import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {MatTableModule} from '@angular/material/table';

// cont datos_tabla: creacionUsuarioDTO() = [
//   {}
// ]

@Component({
  selector: 'app-indice-usuarios',
  imports: [MatButtonModule, RouterLink, MatTableModule],
  templateUrl: './indice-usuarios.component.html',
  styleUrl: './indice-usuarios.component.css'
})
export class IndiceUsuariosComponent {

}
// function creacionUsuarioDTO() {
//   throw new Error('Function not implemented.');
// }

