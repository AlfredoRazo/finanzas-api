import { NgModule } from '@angular/core';
import { GuardService } from './services/guard.service';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
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

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: MainComponent, canActivate: [GuardService] },
  { path: 'clientes', component: ClientesComponent, canActivate: [GuardService] },
  { path: 'clientes/maniobrista', component: ManiobristaComponent, canActivate: [GuardService] },
  { path: 'clientes/agente-aduanal', component: AgenteAduanalComponent, canActivate: [GuardService] },
  { path: 'clientes/agente-aduanal/nueva-solicitud', component: AgenteNuevaSolicitudComponent, canActivate: [GuardService] },
  { path: 'clientes/naviera', component: NavieraComponent, canActivate: [GuardService] },
  { path: 'facturacion', component: FacturacionComponent, canActivate: [GuardService] },
  { path: 'recinto', component: RecintoComponent, canActivate: [GuardService] },
  { path: 'recinto/nueva-solicitud', component: RecintoNuevaSolicitudComponent, canActivate: [GuardService] },
  { path: 'estadistica', component: EstadisticaComponent, canActivate: [GuardService] },
  { path: 'operaciones', component: OperacionesComponent, canActivate: [GuardService] },
  { path: 'operaciones/nuevo-pago', component: OperacionesNuevoPagoComponent, canActivate: [GuardService] },
  { path: 'proteccion-portuaria', component: ProteccionPortuariaComponent, canActivate: [GuardService] },
  { path: 'proteccion-portuaria/generar-consulta', component: PpGenerarConsultaComponent, canActivate: [GuardService] },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
