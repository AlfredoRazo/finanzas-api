import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maniobrista',
  templateUrl: './maniobrista.component.html',
  styleUrls: ['./maniobrista.component.css']
})
export class ManiobristaComponent implements OnInit {
  pageHechos = 1;
  dataHechos = [
    {codigo: 123, buque: 'Buque', tipoBuque: 'Tipo Buque', viaje: 'Viaje', tipoTrafico: 'Un tipo tráfico', tipoManiobra: 'Tipo Maniobra', producto: 'Producto', tipoProducto: 'Tipo Producto', tramo: 'Un tramo', trafico: 'Un tráfico', imp:'Imp', exp: 'exp' },
  ]
  submenu = 1;
  pageManiobra = 1;
  dataManiobra = [
    {buque: 'Buque', viaje: 'Viaje', operadora: 'Operadora',  tipoTrafico: 'Un tipo tráfico', recintoES: 'Recinto', tipoManiobra: 'Tipo Maniobra', producto: 'Un producto', embalaje: 'Un embalaje', bulto:'123', tipoProducto: 'Tipo Producto', tramo: 'Un tramo', trafico: 'Un tráfico'},
  ]
  pagePagos = 1;
  dataPagos = [
    {
      id: 123,
      fecha: '28/05/2021',
      concepto: 'Pago de aranceles',
      total: '38987',
      estado: 'Pendiente',
      cfdi: ''
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
