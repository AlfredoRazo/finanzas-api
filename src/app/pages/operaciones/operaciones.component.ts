import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.css']
})
export class OperacionesComponent implements OnInit {
  submenu = 1;
  page = 1;
  data = [
    {
      id: 123,
      fecha: '28/05/2021',
      cliente: 'La junta',
      tipoSolicitud: 'Pago de aranceles',
      estado: 'Pendiente'
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
