import { DatePipe, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListadoCalendariosComponent } from "./calendarios/listado-calendarios/listado-calendarios.component";
import { MenuComponent } from "./compartidos/componentes/menu/menu.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    ListadoCalendariosComponent, 
    MenuComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  
}
