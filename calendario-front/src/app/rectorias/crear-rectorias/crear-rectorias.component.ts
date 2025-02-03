import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-rectorias',
  imports: [MatButtonModule],
  templateUrl: './crear-rectorias.component.html',
  styleUrl: './crear-rectorias.component.css'
})
export class CrearRectoriasComponent {
  
  router = inject(Router);

  guardarCambios() {
    //.. guardar los cambios
    this.router.navigate(['/rectorias'])
  }

}
