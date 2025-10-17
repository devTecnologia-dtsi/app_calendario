import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { NotificacionService } from '../../compartidos/servicios/notificacion.service';
import { FormularioUsuariosComponent } from '../formulario-usuarios/formulario-usuarios.component';
import { MostrarErroresComponent } from '../../compartidos/componentes/mostrar-errores/mostrar-errores.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-editar-usuarios',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormularioUsuariosComponent, MostrarErroresComponent],
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  usuario?: UsuarioDTO;
  errores: string[] = [];
  cargando = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.usuarioService.consultarUsuario(id)
        .pipe(finalize(() => (this.cargando = false)))
        .subscribe({
          next: (resp) => {
            if (resp.status === 1) {
              this.usuario = resp.data.usuario;
              this.usuario.permisos = resp.data.permisos ?? [];
            } else {
              this.notificacionService.mostrarAdvertencia('Usuario no encontrado');
              this.router.navigate(['/usuarios']);
            }
          },
          error: () => {
            this.notificacionService.mostrarError('Error al cargar usuario');
            this.router.navigate(['/usuarios']);
          }
        });
    }
  }

  guardarCambios(usuarioEditado: UsuarioCreacionDTO) {
    if (!this.usuario) return;
    this.usuarioService.actualizarUsuario(this.usuario.id_usuario, usuarioEditado).subscribe({
      next: (resp) => {
        if (resp.status === 1) {
          this.notificacionService.mostrarExito(resp.message || 'Usuario actualizado correctamente');
          this.router.navigate(['/usuarios']);
        } else if (resp.status === 2) {
          this.notificacionService.mostrarInfo(resp.message || 'No se realizaron cambios en el usuario');
        } else {
          this.notificacionService.mostrarError(resp.message || 'Error al actualizar el usuario');
        }
      },
      error: () => this.notificacionService.mostrarError('Error al actualizar usuario')
    });
  }
}
