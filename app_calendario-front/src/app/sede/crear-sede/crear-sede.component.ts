import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { SedeCreacionDTO } from '../sede';
import { FormularioSedeComponent } from "../formulario-sede/formulario-sede.component";


@Component({
  selector: 'app-crear-sede',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    FormularioSedeComponent
],
  templateUrl: './crear-sede.component.html',
  styleUrl: './crear-sede.component.css'
})
export class CrearSedeComponent {

  private router = inject (Router);

  guardarCambios(sede: SedeCreacionDTO){
    //..guardar cambios

    //Para que despues de que guarde redirija al formulario de sedes.
    //this.router.navigate(['/sedes'])
    console.log('Creando la sede: ', sede);
  }
}
