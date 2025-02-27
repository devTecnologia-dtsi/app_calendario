import { Component, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { FormularioUsuariosComponent } from "../formulario-usuarios/formulario-usuarios.component";
import { UsuarioCreacionDTO, UsuarioDTO } from '../usuario';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-usuarios',
  imports: [
    FormularioUsuariosComponent,
    HttpClientModule
  ],
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  usuario: UsuarioDTO | undefined;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.http.get<UsuarioDTO>(`http://localhost/calendario-back/src/models/usuario.php?id=${this.id}`).subscribe(data => {
      this.usuario = data;
    });
  }

  guardarCambios(usuario: UsuarioCreacionDTO){
    this.http.put(`http://localhost/calendario-back/src/models/usuario.php?id=${this.id}`, usuario).subscribe(() => {
      this.router.navigate(['/usuarios']);
    });
  }
}
