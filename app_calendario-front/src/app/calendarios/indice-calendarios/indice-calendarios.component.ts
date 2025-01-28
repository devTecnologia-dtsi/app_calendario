import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-indice-calendarios',
  standalone: true,
  imports: [RouterLink, MatButton],
  templateUrl: './indice-calendarios.component.html',
  styleUrl: './indice-calendarios.component.css'
})
export class IndiceCalendariosComponent {

}
