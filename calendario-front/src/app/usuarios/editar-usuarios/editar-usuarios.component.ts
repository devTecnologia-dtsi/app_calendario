import { Component, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { FormularioUsuariosComponent } from "../formulario-usuarios/formulario-usuarios.component";
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../compartidos/servicios/usuario.service';
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";
import { MostrarErroresComponent } from "../../compartidos/componentes/mostrar-errores/mostrar-errores.component";
import { extraerErrores } from '../../compartidos/funciones/extraerErrores';

@Component({
  selector: 'app-editar-usuarios',
  standalone: true,
  imports: [
    FormularioUsuariosComponent,
    HttpClientModule,
    CargandoComponent,
    MostrarErroresComponent
],
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})

export class EditarUsuariosComponent implements OnInit {
  // ngOnInit(): void {
  //   this.usuarioService.consultarUsuario(this.id).subscribe(usuario => {
  //     console.log('ID del usuario recibido en EditarUsuariosComponent:', this.id);
  //     this.usuario = usuario;
  //   });
  // }

  ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        console.log('ID del usuario recibido en EditarUsuariosComponent:', this.id);
        this.usuarioService.consultarUsuario(this.id).subscribe(data => {
          console.log('Datos del usuario recibidos del servicio:', data);
          this.usuario = data;
        }, error => {
          console.error('Error al consultar el usuario:', error);
        });
      }

  @Input({transform: numberAttribute})
  id!: number;
  usuario?: UsuarioDTO;
  usuarioService = inject(UsuarioService);
  errores: string[] = [];
  router = inject(Router);
  route = inject(ActivatedRoute);

  guardarCambios(usuario: UsuarioCreacionDTO){
    this.usuarioService.actualizarUsuario(this.id, usuario).subscribe({
      next: () => {
        this.router.navigate(['/usuarios']);
      },
      error: err => {
        const errores = extraerErrores(err);
        this.errores = errores;
      }
    });
  }

}

// export class EditarUsuariosComponent implements OnInit {

//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private usuarioService = inject(UsuarioService);
//   usuario: UsuarioDTO | undefined;

//   @Input({transform: numberAttribute})
//   id!: number;

//   ngOnInit(): void {
//     this.id = this.route.snapshot.params['id'];
//     console.log('ID del usuario recibido en EditarUsuariosComponent:', this.id);
//     this.usuarioService.consultarUsuario(this.id).subscribe(data => {
//       console.log('Datos del usuario recibidos del servicio:', data);
//       this.usuario = data;
//     }, error => {
//       console.error('Error al consultar el usuario:', error);
//     });
//   }

//   guardarCambios(usuario: UsuarioCreacionDTO){
//     console.log('Datos enviados al servicio:', usuario);
//     this.usuarioService.actualizarUsuario(this.id, usuario).subscribe(() => {
//       this.router.navigate(['/usuarios']);
//     });
//   }
// }
