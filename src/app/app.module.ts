import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { NavComponent } from './components/nav/nav.component';
import { UserComponent } from './components/user/user.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { RecintoComponent } from './pages/recinto/recinto.component';
import { EstadisticaComponent } from './pages/estadistica/estadistica.component';
import { OperacionesComponent } from './pages/operaciones/operaciones.component';
import { ProteccionPortuariaComponent } from './pages/proteccion-portuaria/proteccion-portuaria.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecintoNuevaSolicitudComponent } from './pages/recinto/recinto-nueva-solicitud/recinto-nueva-solicitud.component';
import { ManiobristaComponent } from './pages/clientes/maniobrista/maniobrista.component';
import { AgenteAduanalComponent } from './pages/clientes/agente-aduanal/agente-aduanal.component';
import { NavieraComponent } from './pages/clientes/naviera/naviera.component';
import { AgenteNuevaSolicitudComponent } from './pages/clientes/agente-aduanal/agente-nueva-solicitud/agente-nueva-solicitud.component';

import { OperacionesNuevoPagoComponent } from './pages/operaciones/operaciones-nuevo-pago/operaciones-nuevo-pago.component';
import { PpGenerarConsultaComponent } from './pages/proteccion-portuaria/pp-generar-consulta/pp-generar-consulta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavComponent,
    UserComponent,
    ClientesComponent,
    FacturacionComponent,
    RecintoComponent,
    EstadisticaComponent,
    OperacionesComponent,
    ProteccionPortuariaComponent,
    RecintoNuevaSolicitudComponent,
    ManiobristaComponent,
    AgenteAduanalComponent,
    NavieraComponent,
    AgenteNuevaSolicitudComponent,
    OperacionesNuevoPagoComponent,
    PpGenerarConsultaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
