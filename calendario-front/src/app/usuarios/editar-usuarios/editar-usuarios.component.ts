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

  @Input({transform: numberAttribute})
  id!: number;
  usuario?: UsuarioDTO;
  usuarioService = inject(UsuarioService);
  errores: string[] = [];
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Obtiene el ID desde la URL solo una vez
    this.id = this.route.snapshot.params['id'];
    // console.log('ID del usuario recibido en EditarUsuariosComponent:', this.id);
  
    // Llama al servicio solo una vez
    this.usuarioService.consultarUsuario(this.id).subscribe({
      next: (respuesta) => {
        // console.log('Respuesta completa del backend:', respuesta);
    
        if (respuesta.status === 1 && respuesta.data) {
          this.usuario = respuesta.data;
        } else {
          console.warn(respuesta.message);
          this.errores.push(respuesta.message);
          this.usuario = undefined;
        }
      },
      error: (error) => {
        // console.error('Error al consultar el usuario:', error);
        this.errores = extraerErrores(error);
      }
    }); 
  }

  guardarCambios(usuario: UsuarioCreacionDTO) {
    this.usuarioService.actualizarUsuario(this.id, usuario).subscribe({
      next: (respuesta) => {
        alert(respuesta.message);  // Muestra el mensaje del SP
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        this.errores = extraerErrores(error);
      }
    });
  }
  
}

  // guardarCambios(usuario: UsuarioCreacionDTO){
  //   this.usuarioService.actualizarUsuario(this.id, usuario).subscribe({ 
  //     next: () => {
  //       this.router.navigate(['/usuarios']);
  //       },
  //       error: err => {
  //         const errores = extraerErrores(err);
  //         this.errores = errores;
  //     }
  //   });
  // }

