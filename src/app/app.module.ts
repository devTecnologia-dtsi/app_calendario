import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component'; // Componente principal
import { DashboardComponent } from './pages/dashboard/dashboard.component'; // Componente del dashboard
import { CalendarioAcademicoComponent } from './pages/calendario-academico/calendario-academico.component'; // Componente del calendario académico
import { CalendarioFinancieroComponent } from './pages/calendario-financiero/calendario-financiero.component'; // Componente del calendario financiero
import { CalendarioGradosComponent } from './pages/calendario-grados/calendario-grados.component'; // Componente del calendario de grados
import { GestionPermisosComponent } from './pages/gestion-permisos/gestion-permisos.component'; // Componente para la gestión de permisos
import { LoginComponent } from './pages/login/login.component'; // Componente de login
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalendarioAcademicoComponent,
    CalendarioFinancieroComponent,
    CalendarioGradosComponent,
    GestionPermisosComponent,
    LoginComponent,
    CalendarComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
