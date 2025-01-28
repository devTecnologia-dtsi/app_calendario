import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-crear-usuarios',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './crear-usuarios.component.html',
  styleUrl: './crear-usuarios.component.css'
})
export class CrearUsuariosComponent {

  private router = inject(Router);

  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    correo: ['', {validators: [Validators.required]}],
    estado: 1,
    id_rectoria: ['', {validators: [Validators.required]}],
    id_sede: ['', {validators: [Validators.required]}],
    fecha_creacion: [new Date().toDateString()],
    id_rol: ['', {validators: [Validators.required]}]
  })


  guardarCambios(){
    //..guardar cambios

    //Para que despues de que guarde redirija al formulario de usuarios.
    // this.router.navigate(['/usuarios'])

    console.log(this.form.value);
  }

}
