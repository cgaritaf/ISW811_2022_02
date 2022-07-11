import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacturasComponent } from './components/facturas/facturas.component';

//Definición de rutas y componentes asociados
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //Para la ruta inicial se pasa al login
  { path: 'login', component: LoginComponent},
  { path: 'perfil', component: PerfilComponent}, 
  { path: 'dashboard', component: DashboardComponent},   //Panel principal para un usuario administrador
  { path: 'dashboard/facturas', component: FacturasComponent}, //CRUD o mantenimiento de facturas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }