import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CrearRolComponent } from './rol/crear-rol/crear-rol.component';
import { IndiceUsuariosComponent } from './usuarios/indice-usuarios/indice-usuarios.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';
import { EditarRolComponent } from './rol/editar-rol/editar-rol.component';
import { EditarUsuariosComponent } from './usuarios/editar-usuarios/editar-usuarios.component';
import { CrearCalendariosComponent } from './calendarios/crear-calendarios/crear-calendarios.component';
import { IndiceCalendariosComponent } from './calendarios/indice-calendarios/indice-calendarios.component';
import { EditarCalendariosComponent } from './calendarios/editar-calendarios/editar-calendarios.component';
import { AcademicoComponent } from './calendarios/academico/academico.component';
import { FinancieroComponent } from './calendarios/financiero/financiero.component';
import { GradosComponent } from './calendarios/grados/grados.component';
import { IndiceRolComponent } from './rol/indice-rol/indice-rol.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'calendarios/crear', component: CrearCalendariosComponent},
    {path: 'calendarios/editar/:id', component: EditarCalendariosComponent},
    {path: 'calendarios/crear/academico', component: AcademicoComponent},
    {path: 'calendarios/crear/financiero', component: FinancieroComponent},
    {path: 'calendarios/crear/grado', component: GradosComponent},
    {path: 'rol', component: IndiceRolComponent},
    {path: 'rol/crear', component: CrearRolComponent},
    {path: 'rol/editar/:id', component: EditarRolComponent},
    {path: 'usuarios', component: IndiceUsuariosComponent},
    {path: 'usuarios/crear', component: CrearUsuariosComponent},
    {path: 'usuarios/editar/:id', component: EditarUsuariosComponent},
    {path: '**', redirectTo: ''},
];
