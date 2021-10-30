import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { OperacionesNuevoPagoComponent } from './pages/operaciones/operaciones-nuevo-pago/operaciones-nuevo-pago.component';
import { PpGenerarConsultaComponent } from './pages/proteccion-portuaria/pp-generar-consulta/pp-generar-consulta.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SortDirective } from './directive/sort.directive';
import { CesionarioComponent } from './pages/clientes/cesionario/cesionario.component';
import { FacturacionNuevaConsultaComponent } from './pages/facturacion/facturacion-nueva-consulta/facturacion-nueva-consulta.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { FacturacionConsultaTipoComponent } from './pages/facturacion/facturacion-consulta-tipo/facturacion-consulta-tipo.component';
import { CfdiComponent } from './components/cfdi/cfdi.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ClientesTableComponent } from './components/clientes-table/clientes-table.component';
import { Santander10Component } from './pages/santander10/santander10.component';
import { PagosTableComponent } from './components/pagos-table/pagos-table.component';
import { RespuestaBancosComponent } from './components/respuesta-bancos/respuesta-bancos.component';
import { ClienteComponent } from './pages/clientes/cliente/cliente.component';
import { RecintoConsultaTipoComponent } from './pages/recinto/recinto-consulta-tipo/recinto-consulta-tipo.component';
import { Bancomer10Component } from './pages/bancomer10/bancomer10.component';
import { Bancomer10FailComponent } from './pages/bancomer10-fail/bancomer10-fail.component';
import { ClienteGenerarConsultaComponent } from './pages/clientes/cliente/cliente-generar-consulta/cliente-generar-consulta.component';
import { TablaBuquesComponent } from './components/tabla-buques/tabla-buques.component';
import { CargaManifiestoComponent } from './components/carga-manifiesto/carga-manifiesto.component';
import { PersonalRecintoComponent } from './components/personal-recinto/personal-recinto.component';
import { SolicitudServicioComponent } from './components/solicitud-servicio/solicitud-servicio.component';
//import { BlInventarioComponent } from './components/bl-inventario/bl-inventario.component';
import { InventarioComponent } from './components/inventario/inventario.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavComponent,
    UserComponent,
    ClientesComponent,
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
    PpGenerarConsultaComponent,
    SortDirective,
    CesionarioComponent,
    FacturacionComponent,
    FacturacionNuevaConsultaComponent,
    FacturacionConsultaTipoComponent,
    CfdiComponent,
    PagosComponent,
    ClientesTableComponent,
    Santander10Component,
    PagosTableComponent,
    RespuestaBancosComponent,
    ClienteComponent,
    RecintoConsultaTipoComponent,
    Bancomer10Component,
    Bancomer10FailComponent,
    ClienteGenerarConsultaComponent,
    TablaBuquesComponent,
    CargaManifiestoComponent,
    PersonalRecintoComponent,
    SolicitudServicioComponent,
  //  BlInventarioComponent,
    InventarioComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxCaptchaModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    
  ],
  providers: [BnNgIdleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
