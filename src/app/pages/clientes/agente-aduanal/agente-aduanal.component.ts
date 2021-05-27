import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agente-aduanal',
  templateUrl: './agente-aduanal.component.html',
  styleUrls: ['./agente-aduanal.component.css']
})
export class AgenteAduanalComponent implements OnInit {
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
