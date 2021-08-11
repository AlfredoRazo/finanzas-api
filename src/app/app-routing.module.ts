import { NgModule } from '@angular/core';
import { GuardService } from './services/guard.service';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { RecintoComponent } from './pages/recinto/recinto.component';
import { EstadisticaComponent } from './pages/estadistica/estadistica.component';
import { OperacionesComponent } from './pages/operaciones/operaciones.component';
import { ProteccionPortuariaComponent } from './pages/proteccion-portuaria/proteccion-portuaria.component';
import { RecintoNuevaSolicitudComponent } from './pages/recinto/recinto-nueva-solicitud/recinto-nueva-solicitud.component';
import { AgenteAduanalComponent } from './pages/clientes/agente-aduanal/agente-aduanal.component';
import { ManiobristaComponent } from './pages/clientes/maniobrista/maniobrista.component';
import { NavieraComponent } from './pages/clientes/naviera/naviera.component';
import { AgenteNuevaSolicitudComponent } from './pages/clientes/agente-aduanal/agente-nueva-solicitud/agente-nueva-solicitud.component';
import { OperacionesNuevoPagoComponent } from './pages/operaciones/operaciones-nuevo-pago/operaciones-nuevo-pago.component';
import { PpGenerarConsultaComponent } from './pages/proteccion-portuaria/pp-generar-consulta/pp-generar-consulta.component';
import { CesionarioComponent } from './pages/clientes/cesionario/cesionario.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { FacturacionNuevaConsultaComponent } from './pages/facturacion/facturacion-nueva-consulta/facturacion-nueva-consulta.component';
import { FacturacionConsultaTipoComponent } from './pages/facturacion/facturacion-consulta-tipo/facturacion-consulta-tipo.component';
import { Santander10Component } from './pages/santander10/santander10.component';
import { ClienteComponent } from './pages/clientes/cliente/cliente.component';
import { RecintoConsultaTipoComponent } from './pages/recinto/recinto-consulta-tipo/recinto-consulta-tipo.component';
import { Bancomer10Component } from './pages/bancomer10/bancomer10.component';
import { Bancomer10FailComponent } from './pages/bancomer10-fail/bancomer10-fail.component';
import { ClienteGenerarConsultaComponent } from './pages/clientes/cliente/cliente-generar-consulta/cliente-generar-consulta.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent, canActivate: [GuardService] },
  { path: 'clientes', component: ClientesComponent, canActivate: [GuardService] },
  { path: 'clientes/maniobrista', component: ManiobristaComponent, canActivate: [GuardService] },
  { path: 'clientes/agente-aduanal', component: AgenteAduanalComponent, canActivate: [GuardService] },
  { path: 'clientes/agente-aduanal/consulta-por-tipo', component: FacturacionConsultaTipoComponent, canActivate: [GuardService] },
  { path: 'clientes/agente-aduanal/nueva-solicitud', component: AgenteNuevaSolicitudComponent, canActivate: [GuardService] },
  { path: 'clientes/naviera', component: NavieraComponent, canActivate: [GuardService] },
  { path: 'clientes/cesionario', component: CesionarioComponent, canActivate: [GuardService] },
  { path: 'clientes/cliente', component: ClienteComponent, canActivate: [GuardService] },
  { path: 'clientes/cliente/consulta-por-tipo', component: ClienteGenerarConsultaComponent, canActivate: [GuardService] },
  { path: 'santander10', component: Santander10Component },
  { path: 'bancomer10', component: Bancomer10Component },
  { path: 'bancomer10-fail', component: Bancomer10FailComponent },
 /* { path: 'facturacion',
  loadChildren: () => import('./pages/facturacion/facturacion.module').then(m => m.FacturacionModule),
  canActivate: [GuardService] },*/
  { path: 'facturacion', component: FacturacionComponent, canActivate: [GuardService] },
  { path: 'facturacion/nueva-consulta', component: FacturacionNuevaConsultaComponent, canActivate: [GuardService] },
  { path: 'facturacion/consulta-por-tipo', component: RecintoConsultaTipoComponent, canActivate: [GuardService] },
  { path: 'facturacion/consulta-buques', component:OperacionesNuevoPagoComponent, canActivate: [GuardService] },
  { path: 'recinto', component: RecintoComponent, canActivate: [GuardService] },
  { path: 'recinto/consulta-por-tipo', component: RecintoConsultaTipoComponent, canActivate: [GuardService] },
  { path: 'recinto/nueva-solicitud', component: RecintoNuevaSolicitudComponent, canActivate: [GuardService] },
  { path: 'estadistica', component: EstadisticaComponent, canActivate: [GuardService] },
  { path: 'estadistica/consulta-por-tipo', component: FacturacionConsultaTipoComponent, canActivate: [GuardService] },
  { path: 'operaciones', component: OperacionesComponent, canActivate: [GuardService] },
  { path: 'operaciones/consulta-por-tipo', component: OperacionesNuevoPagoComponent, canActivate: [GuardService] },
  
  { path: 'proteccion-portuaria', component: ProteccionPortuariaComponent, canActivate: [GuardService] },
  { path: 'proteccion-portuaria/consulta-por-tipo', component: FacturacionConsultaTipoComponent, canActivate: [GuardService] },
  { path: 'proteccion-portuaria/generar-consulta', component: PpGenerarConsultaComponent, canActivate: [GuardService] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
