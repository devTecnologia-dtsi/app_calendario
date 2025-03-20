import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Componentes y servicios personalizados
import { FormularioUsuariosComponent } from '../formulario-usuarios/formulario-usuarios.component';
import { MostrarErroresComponent } from '../../compartidos/componentes/mostrar-errores/mostrar-errores.component';
import { UsuarioCreacionDTO } from '../usuario';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
import { extraerErrores } from '../../compartidos/funciones/extraerErrores';

@Component({
  selector: 'app-crear-usuarios',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormularioUsuariosComponent,
    MostrarErroresComponent
  ],
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css']
})
export class CrearUsuariosComponent {

  // Manejo de errores
  errores: string[] = [];

  // Inyecciones de dependencias
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private notificacionService = inject(NotificacionService);

  // Método para guardar cambios
  guardarCambios(usuario: UsuarioCreacionDTO) {
    this.usuarioService.crearUsuario(usuario).subscribe({
      next: (respuesta) => {
        this.notificacionService.mostrarExito(respuesta.message || "Usuario insertado correctamente.");
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        this.errores = extraerErrores(error);
        this.notificacionService.mostrarError(error.message || "Error en la creación del usuario.");
      }
    });
  }
}
