import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ListadoGenericoComponent } from "../../compartidos/componentes/listado-generico/listado-generico.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listado-calendarios',
  imports: [DatePipe, ListadoGenericoComponent, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './listado-calendarios.component.html',
  styleUrl: './listado-calendarios.component.css'
})
export class ListadoCalendariosComponent implements OnInit {
  ngOnInit(): void {
    
  }

  @Input({required: true})
  calendarios!: any[];

}
