import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { FormularioUsuariosComponent } from "../formulario-usuarios/formulario-usuarios.component";
import { UsuarioCreacionDTO } from '../usuario';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-crear-usuarios',
  standalone: true,
  imports: [
    MatButtonModule, 
    RouterLink, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatSelectModule, 
    FormularioUsuariosComponent,
    HttpClientModule
  ],
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css']
})
export class CrearUsuariosComponent {

  private router = inject(Router);
  private http = inject(HttpClient);

  guardarCambios(usuario: UsuarioCreacionDTO) {
    //validación de datos
    console.log('Datos del formulario:', usuario);
    const url = 'http://localhost/calendario-back/src/routes/rutas.php/insertarusuario';

    // Encabezados para JSON
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Realizar petición HTTP
    this.http.post(url, usuario, { headers }).subscribe({
      next: () => {
        alert('Usuario creado exitosamente');
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        alert('Hubo un error al crear el usuario.');
      }
    });
  }
}
