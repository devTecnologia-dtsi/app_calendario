import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-crear-rectoria',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './crear-rectoria.component.html',
  styleUrl: './crear-rectoria.component.css'
})
export class CrearRectoriaComponent {
  private router = inject(Router);

  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    codigo: ['', {validator:[Validators.required]}],
    nombre: ['', {validator:[Validators.required]}],
    estado: 1
  })

  guardarCambios(){

    //..guardar cambios

    //Para que despues de que guarde redirija al formulario de sedes.
    //this.router.navigate(['/rectorias'])

    console.log(this.form.value);
  }
}
