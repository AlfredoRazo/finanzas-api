import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturacionConsultaTipoComponent } from './facturacion-consulta-tipo/facturacion-consulta-tipo.component';
import { FacturacionNuevaConsultaComponent } from './facturacion-nueva-consulta/facturacion-nueva-consulta.component';
import { FacturacionComponent } from './facturacion.component';



@NgModule({
  declarations: [
   /* FacturacionComponent,
    FacturacionNuevaConsultaComponent,
    FacturacionConsultaTipoComponent,*/
  ],
  imports: [
    CommonModule
  ]
})
export class FacturacionModule { }
