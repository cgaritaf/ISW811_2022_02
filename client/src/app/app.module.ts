import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ReportesComponent } from './components/reportes/reportes.component';

import { SharedModule } from './components/shared/shared.module';

import { HttpClientModule } from '@angular/common/http';
import { FacturasFormComponent } from './components/facturas/facturas-form/facturas-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FacturasComponent,
    InicioComponent,
    LoginComponent,
    NavbarComponent,
    PerfilComponent,
    ReportesComponent,
    FacturasFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
