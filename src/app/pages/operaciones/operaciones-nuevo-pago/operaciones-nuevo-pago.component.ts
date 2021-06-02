import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operaciones-nuevo-pago',
  templateUrl: './operaciones-nuevo-pago.component.html',
  styleUrls: ['./operaciones-nuevo-pago.component.css']
})
export class OperacionesNuevoPagoComponent implements OnInit {
  tipoArribo = [{id: 1, descripcion : 'Regular'},{id: 2, descripcion : 'Forzoso'},{id: 3, descripcion : 'Combustible'},{id: 4, descripcion : 'Imprevisto'},{id: 5, descripcion : 'Reparación'}];
  tipoTrafico = [{id: 1, descripcion : 'Alta'},{id: 2, descripcion : 'Cabotaje'}];
  tipoActividad = [{id: 1, descripcion : 'Comercial'},{id: 2, descripcion : 'Pesquera'},{id: 3, descripcion : 'Riberño'}];
  tipoArancel = [{id: 1, descripcion : 'Atraque'},{id: 2, descripcion : 'Puerto Fijo'},{id: 1, descripcion : 'Puerto Variable'}];
  pageAtraque = 1;
  dataAtraque = [
    {
      id: 123,
      fecha: '28/05/2021',
      concepto: 'La junta',
      total: 10000,
      estado: 'Pendiente'
    }
  ];
  pagePuerto = 1;
  dataPuerto = [
    {
      id: 123,
      fecha: '28/05/2021',
      concepto: 'La junta',
      total: 10000,
      estado: 'Pendiente'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
