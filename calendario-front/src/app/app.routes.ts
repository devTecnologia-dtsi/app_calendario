import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceUsuariosComponent } from './usuarios/indice-usuarios/indice-usuarios.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';
import { EditarUsuariosComponent } from './usuarios/editar-usuarios/editar-usuarios.component';
import { EditarCalendariosComponent } from './calendarios/editar-calendarios/editar-calendarios.component';
import { IndiceRolComponent } from './rol/indice-rol/indice-rol.component';
import { LogsComponent } from './logs/logs.component';
import { FormularioCalendariosComponent } from './calendarios/formulario-calendarios/formulario-calendarios.component';
import { LoginComponent } from './seguridad/login/login.component';
import { RolGuard } from './seguridad/rol.guard';
import { CalendarioGuard } from './seguridad/calendario.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: LandingPageComponent},
    {path: 'calendarios/crear/:tipo', component: FormularioCalendariosComponent, canActivate: [CalendarioGuard] },
    {path: 'calendarios/editar/:id', component: EditarCalendariosComponent},
    {path: 'rol', component: IndiceRolComponent, canActivate: [RolGuard]},
    {path: 'usuarios', component: IndiceUsuariosComponent, canActivate: [RolGuard]},
    {path: 'usuarios/crear', component: CrearUsuariosComponent, canActivate: [RolGuard]},
    {path: 'usuarios/editar/:id', component: EditarUsuariosComponent, canActivate: [RolGuard]},
    {path: 'logs', component: LogsComponent, canActivate: [RolGuard]},
    {path: '**', redirectTo: 'login'},
];
