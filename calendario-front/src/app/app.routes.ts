import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceUsuariosComponent } from './usuarios/indice-usuarios/indice-usuarios.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';
import { EditarUsuariosComponent } from './usuarios/editar-usuarios/editar-usuarios.component';
import { EditarCalendariosComponent } from './calendarios/editar-calendarios/editar-calendarios.component';
import { IndiceRolComponent } from './rol/indice-rol/indice-rol.component';
import { LogsComponent } from './logs/logs.component';
import { FormularioCalendariosComponent } from './calendarios/formulario-calendarios/formulario-calendarios.component';
import { esAdminGuard } from './compartidos/guards/es-admin.guard';
import { LoginComponent } from './seguridad/login/login.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'calendarios/crear/:tipo', component: FormularioCalendariosComponent},
    {path: 'calendarios/editar/:id', component: EditarCalendariosComponent},
    {path: 'rol', component: IndiceRolComponent, canActivate: [esAdminGuard]},
    {path: 'usuarios', component: IndiceUsuariosComponent, canActivate: [esAdminGuard]},
    {path: 'usuarios/crear', component: CrearUsuariosComponent},
    {path: 'usuarios/editar/:id', component: EditarUsuariosComponent},
    {path: 'logs', component: LogsComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: ''},
];
