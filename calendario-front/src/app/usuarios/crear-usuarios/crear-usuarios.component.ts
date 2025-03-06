import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { FormularioUsuariosComponent } from "../formulario-usuarios/formulario-usuarios.component";
import { UsuarioCreacionDTO } from '../usuario';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { extraerErrores } from '../../compartidos/funciones/extraerErrores';
import { MostrarErroresComponent } from "../../compartidos/componentes/mostrar-errores/mostrar-errores.component";

@Component({
  selector: 'app-crear-usuarios',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormularioUsuariosComponent,
    MostrarErroresComponent
],
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css']
})
export class CrearUsuariosComponent {

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  errores: string[] = [];

  guardarCambios(usuario: UsuarioCreacionDTO) {
    //validación de datos
    console.log('Datos del formulario:', usuario);

    this.usuarioService.crearUsuario(usuario).subscribe({
      next: () => {
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        const errores = extraerErrores(err);
        this.errores = errores;
      }
    });

    // Utiliza el servicio para insertar el usuario
    // this.usuarioService.insertarUsuario(usuario).subscribe({
    //   next: () => {
    //     alert('Usuario creado exitosamente');
    //     this.router.navigate(['/usuarios']);
    //   },
    //   error: (error) => {
    //     console.error('Error al crear usuario:', error);
    //     alert('Hubo un error al crear el usuario.');
    //   }
    // });
  }
}
