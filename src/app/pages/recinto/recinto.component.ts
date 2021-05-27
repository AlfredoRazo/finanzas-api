import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recinto',
  templateUrl: './recinto.component.html',
  styleUrls: ['./recinto.component.css']
})
export class RecintoComponent implements OnInit {
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
