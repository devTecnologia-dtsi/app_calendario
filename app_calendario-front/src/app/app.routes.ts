import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './autenticacion/login/login.component';
import { CrearCalendariosComponent } from './calendarios/crear-calendarios/crear-calendarios.component';
import { MenuComponent } from './compartidos/menu/menu.component';
import { AcademicoComponent } from './calendarios/academico/academico.component';
import { FinancieroComponent } from './calendarios/financiero/financiero.component';
import { GradosComponent } from './calendarios/grados/grados.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';
import { EditarUsuariosComponent } from './usuarios/editar-usuarios/editar-usuarios.component';
import { IndiceUsuariosComponent } from './usuarios/indice-usuarios/indice-usuarios.component';
import { IndiceCalendariosComponent } from './calendarios/indice-calendarios/indice-calendarios.component';
import { IndiceSedesComponent } from './sede/indice-sedes/indice-sedes.component';
import { CrearSedeComponent } from './sede/crear-sede/crear-sede.component';
import { EditarSedeComponent } from './sede/editar-sede/editar-sede.component';
import { EditarCalendariosComponent } from './calendarios/editar-calendarios/editar-calendarios.component';
import { IndiceRectoriaComponent } from './rectoria/indice-rectoria/indice-rectoria.component';
import { CrearRectoriaComponent } from './rectoria/crear-rectoria/crear-rectoria.component';
import { EditarRectoriaComponent } from './rectoria/editar-rectoria/editar-rectoria.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  //{ path: 'calendario/crear', component: CrearCalendariosComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent},
  { path: 'usuarios', component: IndiceUsuariosComponent },
  { path: 'usuarios/crear', component: CrearUsuariosComponent },
  { path: 'usuarios/editar/:id', component: EditarUsuariosComponent },
  { path: 'rectorias', component: IndiceRectoriaComponent },
  { path: 'rectorias/crear', component: CrearRectoriaComponent },
  { path: 'rectorias/editar/:id', component: EditarRectoriaComponent },
  { path: 'sedes', component: IndiceSedesComponent },
  { path: 'sedes/crear', component: CrearSedeComponent },
  { path: 'sedes/editar/:id', component: EditarSedeComponent  },
  // { path: 'calendario', component: IndiceCalendariosComponent },
  // { path: 'calendarios/crear', component: CrearCalendariosComponent},
  // { path: 'calendarios/editar/:id', component: EditarCalendariosComponent },
  // { path: 'calendarios/academico', component: AcademicoComponent },
  // { path: 'calendarios/financiero', component: FinancieroComponent },
  // { path: 'calendarios/grados', component: GradosComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
