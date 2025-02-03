import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceRectoriasComponent } from './rectorias/indice-rectorias/indice-rectorias.component';
import { CrearRectoriasComponent } from './rectorias/crear-rectorias/crear-rectorias.component';
import { IndiceSedesComponent } from './sedes/indice-sedes/indice-sedes.component';
import { CrearSedesComponent } from './sedes/crear-sedes/crear-sedes.component';
import { IndicePeriodosComponent } from './periodos/indice-periodos/indice-periodos.component';
import { CrearPeriodosComponent } from './periodos/crear-periodos/crear-periodos.component';
import { IndiceRolComponent } from './rol/indice-rol/indice-rol.component';
import { CrearRolComponent } from './rol/crear-rol/crear-rol.component';
import { IndiceUsuariosComponent } from './usuarios/indice-usuarios/indice-usuarios.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'rectorias', component: IndiceRectoriasComponent},
    {path: 'rectorias/crear', component: CrearRectoriasComponent},
    {path: 'sedes', component: IndiceSedesComponent},
    {path: 'sedes/crear', component: CrearSedesComponent},
    {path: 'periodos', component: IndicePeriodosComponent},
    {path: 'periodos/crear', component: CrearPeriodosComponent},
    {path: 'rol', component: IndiceRolComponent},
    {path: 'rol/crear', component: CrearRolComponent},
    {path: 'usuarios', component: IndiceUsuariosComponent},
    {path: 'usuarios/crear', component: CrearUsuariosComponent}
];
