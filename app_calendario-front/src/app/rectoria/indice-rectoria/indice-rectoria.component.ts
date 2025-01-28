import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-indice-rectoria',
  standalone: true,
  imports: [RouterLink, MatButton],
  templateUrl: './indice-rectoria.component.html',
  styleUrl: './indice-rectoria.component.css'
})
export class IndiceRectoriaComponent {

}
