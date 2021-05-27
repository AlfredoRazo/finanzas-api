import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operaciones-nuevo-pago',
  templateUrl: './operaciones-nuevo-pago.component.html',
  styleUrls: ['./operaciones-nuevo-pago.component.css']
})
export class OperacionesNuevoPagoComponent implements OnInit {
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
