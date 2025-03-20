import { Component, OnInit, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

// Componentes y servicios personalizados
import { FormularioUsuariosComponent } from '../formulario-usuarios/formulario-usuarios.component';
import { CargandoComponent } from '../../compartidos/componentes/cargando/cargando.component';
import { MostrarErroresComponent } from '../../compartidos/componentes/mostrar-errores/mostrar-errores.component';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';

// Modelos y utilidades
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { extraerErrores } from '../../compartidos/funciones/extraerErrores';

@Component({
  selector: 'app-editar-usuarios',
  standalone: true,
  imports: [
    HttpClientModule,
    FormularioUsuariosComponent,
    CargandoComponent,
    MostrarErroresComponent
  ],
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {
  
  // Propiedades
  usuario?: UsuarioDTO;
  errores: string[] = [];

  // Inyecciones de dependencias
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificacionService = inject(NotificacionService);

  // Inicialización del componente
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (isNaN(id) || id <= 0) {
      this.notificacionService.mostrarError("ID de usuario no válido.");
      return;
    }

    // Consultar usuario
    this.usuarioService.consultarUsuario(id).subscribe({
      next: (respuesta) => {
        if (respuesta.status === 1 && respuesta.data) {
          this.usuario = respuesta.data;
        } else {
          this.notificacionService.mostrarError(respuesta.message || "Error al obtener el usuario.");
        }
      },
      error: (error) => {
        this.errores = extraerErrores(error);
        this.notificacionService.mostrarError("Error en la consulta del usuario.");
      }
    });
  }

  // Método para guardar cambios
  guardarCambios(usuario: UsuarioCreacionDTO) {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!this.usuario || isNaN(id)) {
      this.notificacionService.mostrarError("No se pudo cargar el usuario o el ID no es válido.");
      return;
    }

    this.usuarioService.actualizarUsuario(id, usuario).subscribe({
      next: (respuesta) => {
        if (respuesta.status === 1) {
          this.notificacionService.mostrarExito(respuesta.message || "Usuario actualizado correctamente");
          this.router.navigate(['/usuarios']);
        } else {
          this.notificacionService.mostrarError(respuesta.message || "Error al actualizar el usuario");
        }
      },
      error: (error) => {
        this.errores = extraerErrores(error);
        this.notificacionService.mostrarError("Error en la actualización");
      }
    });
  }
}
