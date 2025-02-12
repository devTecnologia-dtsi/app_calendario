import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { FormularioUsuariosComponent } from "../formulario-usuarios/formulario-usuarios.component";
import { UsuarioCreacionDTO } from '../usuario';

@Component({
  selector: 'app-crear-usuarios',
  imports: [
    MatButtonModule, 
    RouterLink, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatSelectModule, 
    FormularioUsuariosComponent],
  templateUrl: './crear-usuarios.component.html',
  styleUrl: './crear-usuarios.component.css'
})
export class CrearUsuariosComponent {

  private router = inject(Router);
  


  guardarCambios(usuario: UsuarioCreacionDTO){
    //this.router.navigate(['/usuarios']);
    console.log('creando el usaurio', usuario);

  }

}
